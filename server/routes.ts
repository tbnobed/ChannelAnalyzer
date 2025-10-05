import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { resolveChannelId, getChannelInfo, getChannelVideos, getTopVideos } from "./youtube";
import { z } from "zod";
import passport from "passport";
import { hashPassword, requireAuth, requireAdmin } from "./auth";
import { insertUserSchema, updateUserSchema, updatePasswordSchema } from "@shared/schema";

const analyzeRequestSchema = z.object({
  channelUrl: z.string(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }

    passport.authenticate("local", (err: any, user: Express.User | false, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to login" });
        }
        res.json({ user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      await storage.getAllChannelAnalyses();
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    } catch (error: any) {
      res.status(503).json({ status: "error", message: error.message });
    }
  });

  // Protected routes - require authentication
  app.post("/api/analyze", requireAuth, async (req, res) => {
    try {
      const { channelUrl } = analyzeRequestSchema.parse(req.body);
      const apiKey = process.env.VITE_YT_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "YouTube API key not configured" });
      }

      const channelId = await resolveChannelId(channelUrl, apiKey);
      const channelInfo = await getChannelInfo(channelId, apiKey);
      
      const [recentVideos, topVideos] = await Promise.all([
        getChannelVideos(channelId, apiKey, 10),
        getTopVideos(channelId, apiKey, 5),
      ]);

      const avgViews = recentVideos.length > 0
        ? Math.round(recentVideos.reduce((sum, v) => sum + v.viewCount, 0) / recentVideos.length)
        : 0;
      const avgLikes = recentVideos.length > 0
        ? Math.round(recentVideos.reduce((sum, v) => sum + v.likeCount, 0) / recentVideos.length)
        : 0;
      const avgComments = recentVideos.length > 0
        ? Math.round(recentVideos.reduce((sum, v) => sum + v.commentCount, 0) / recentVideos.length)
        : 0;
      
      const engagementRate = avgViews > 0 
        ? parseFloat(((avgLikes + avgComments) / avgViews * 100).toFixed(2))
        : 0;

      console.log("Calling n8n webhook with channelId:", channelId);
      let n8nData: any = {};
      
      try {
        const n8nResponse = await fetch("https://n8n.obtv.io/webhook/analyze-channel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelId }),
        });
        
        console.log("n8n webhook status:", n8nResponse.status);
        
        if (!n8nResponse.ok) {
          console.error("n8n webhook error - status:", n8nResponse.status);
          const errorText = await n8nResponse.text();
          console.error("n8n webhook error response:", errorText);
        } else {
          const responseText = await n8nResponse.text();
          console.log("n8n webhook raw response:", responseText);
          
          try {
            n8nData = JSON.parse(responseText);
            console.log("n8n webhook parsed data:", JSON.stringify(n8nData, null, 2));
          } catch (parseError) {
            console.error("Failed to parse n8n response as JSON:", parseError);
          }
        }
      } catch (error) {
        console.error("Error calling n8n webhook:", error);
      }

      // Extract subscriber growth projections from structured data
      let subscriberGrowth = "+0%";
      let subscriberChartData = [channelInfo.subscriberCount];
      let subscriberChartLabels = ["Current"];
      
      if (n8nData.projections && n8nData.projections.subs12) {
        const threeMonthSubs = n8nData.projections.subs3;
        const sixMonthSubs = n8nData.projections.subs6;
        const twelveMonthSubs = n8nData.projections.subs12;
        
        // Calculate 12-month growth percentage
        const growthPercent = ((twelveMonthSubs - channelInfo.subscriberCount) / channelInfo.subscriberCount * 100).toFixed(1);
        subscriberGrowth = `+${growthPercent}% (12mo)`;
        
        // Create chart data with projections
        subscriberChartData = [
          channelInfo.subscriberCount,
          threeMonthSubs,
          sixMonthSubs,
          twelveMonthSubs
        ];
        subscriberChartLabels = ["Current", "3 months", "6 months", "12 months"];
      }
      
      // Handle aiInsights - can be string or object
      let aiInsightsText = "Analysis complete.";
      if (n8nData.aiInsights) {
        if (typeof n8nData.aiInsights === 'string') {
          aiInsightsText = n8nData.aiInsights;
        } else if (n8nData.aiInsights.summary) {
          aiInsightsText = n8nData.aiInsights.summary;
          if (n8nData.aiInsights.recommendations && Array.isArray(n8nData.aiInsights.recommendations)) {
            aiInsightsText += "\n\n### Recommendations\n" + n8nData.aiInsights.recommendations.join("\n");
          }
        }
      }

      const analysisData = {
        channelId,
        channelName: channelInfo.title,
        channelUrl,
        monthlyRevenue: n8nData.profitability?.estMonthlyRevenue ?? 0,
        profitMargin: n8nData.profitability?.marginPercent ?? 0,
        mcnShare: parseInt(n8nData.profitability?.mcnSharePercent) || 0,
        avgViews,
        avgLikes,
        avgComments,
        engagementRate,
        riskLevel: n8nData.riskAnalysis?.level?.toLowerCase() ?? "unknown",
        totalSubscribers: channelInfo.subscriberCount,
        subscriberGrowth,
        subscriberChartData,
        subscriberChartLabels,
        aiInsights: aiInsightsText,
      };

      const analysis = await storage.createChannelAnalysis(analysisData);

      const videoRecords = [
        ...topVideos.map(v => ({
          analysisId: analysis.id,
          videoId: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          publishedAt: v.publishedAt,
          viewCount: v.viewCount,
          likeCount: v.likeCount,
          commentCount: v.commentCount,
          isTopVideo: 1,
        })),
        ...recentVideos.map(v => ({
          analysisId: analysis.id,
          videoId: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          publishedAt: v.publishedAt,
          viewCount: v.viewCount,
          likeCount: v.likeCount,
          commentCount: v.commentCount,
          isTopVideo: 0,
        })),
      ];

      await storage.createVideos(videoRecords);

      res.json({
        analysis,
        topVideos,
        recentVideos,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze channel" });
    }
  });

  app.get("/api/analyses", requireAuth, async (req, res) => {
    try {
      const analyses = await storage.getAllChannelAnalyses();
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/analyses/:id/videos", requireAuth, async (req, res) => {
    try {
      const videos = await storage.getVideosByAnalysisId(req.params.id);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/analyses/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteChannelAnalysis(req.params.id);
      res.json({ message: "Analysis deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User management routes - admin only
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const users = allUsers.map(({ password, ...user }) => user);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { username } = updateUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.updateUser(id, { username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id/password", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = updatePasswordSchema.parse(req.body);
      
      const hashedPassword = await hashPassword(password);
      const user = await storage.updateUserPassword(id, hashedPassword);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      if (req.user?.id === id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }

      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
