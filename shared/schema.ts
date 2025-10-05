import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const channelAnalyses = pgTable("channel_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: text("channel_id").notNull(),
  channelName: text("channel_name").notNull(),
  channelUrl: text("channel_url").notNull(),
  monthlyRevenue: real("monthly_revenue"),
  profitMargin: real("profit_margin"),
  mcnShare: real("mcn_share"),
  avgViews: integer("avg_views"),
  avgLikes: integer("avg_likes"),
  avgComments: integer("avg_comments"),
  engagementRate: real("engagement_rate"),
  riskLevel: text("risk_level").notNull(),
  totalSubscribers: integer("total_subscribers"),
  subscriberGrowth: text("subscriber_growth"),
  subscriberChartData: jsonb("subscriber_chart_data").$type<number[]>(),
  subscriberChartLabels: jsonb("subscriber_chart_labels").$type<string[]>(),
  aiInsights: text("ai_insights").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChannelAnalysisSchema = createInsertSchema(channelAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertChannelAnalysis = z.infer<typeof insertChannelAnalysisSchema>;
export type ChannelAnalysis = typeof channelAnalyses.$inferSelect;

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  analysisId: varchar("analysis_id").notNull(),
  videoId: text("video_id").notNull(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  publishedAt: text("published_at").notNull(),
  viewCount: integer("view_count"),
  likeCount: integer("like_count"),
  commentCount: integer("comment_count"),
  isTopVideo: integer("is_top_video").notNull().default(0),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
