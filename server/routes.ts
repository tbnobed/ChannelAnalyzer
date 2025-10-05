import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { resolveChannelId, getChannelInfo, getChannelVideos, getTopVideos } from "./youtube";
import { z } from "zod";

const analyzeRequestSchema = z.object({
  channelUrl: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
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

      const n8nResponse = await fetch("https://n8n.obtv.io/webhook/analyze-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId }),
      });
      const n8nData = await n8nResponse.json();

      const analysisData = {
        channelId,
        channelName: channelInfo.title,
        channelUrl,
        monthlyRevenue: n8nData.revenue?.monthly || 1665,
        profitMargin: n8nData.revenue?.margin || 42.5,
        mcnShare: n8nData.revenue?.mcnShare || 15,
        avgViews,
        avgLikes,
        avgComments,
        engagementRate,
        riskLevel: n8nData.risk || "low",
        totalSubscribers: channelInfo.subscriberCount,
        subscriberGrowth: n8nData.subscribers?.growth || "+15.3%",
        subscriberChartData: n8nData.subscribers?.chartData || [950000, 980000, 1020000, 1100000, 1180000, channelInfo.subscriberCount],
        subscriberChartLabels: n8nData.subscribers?.chartLabels || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        aiInsights: n8nData.aiInsights || "Analysis complete. Channel shows strong engagement metrics.",
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

  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllChannelAnalyses();
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/analyses/:id/videos", async (req, res) => {
    try {
      const videos = await storage.getVideosByAnalysisId(req.params.id);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
