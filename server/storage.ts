import { type User, type InsertUser, type ChannelAnalysis, type InsertChannelAnalysis, type Video, type InsertVideo } from "@shared/schema";
import { db } from "../db";
import { users, channelAnalyses, videos } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createChannelAnalysis(analysis: InsertChannelAnalysis): Promise<ChannelAnalysis>;
  getChannelAnalysisByChannelId(channelId: string): Promise<ChannelAnalysis | undefined>;
  getAllChannelAnalyses(): Promise<ChannelAnalysis[]>;
  
  createVideo(video: InsertVideo): Promise<Video>;
  createVideos(videos: InsertVideo[]): Promise<Video[]>;
  getVideosByAnalysisId(analysisId: string): Promise<Video[]>;
  getTopVideosByAnalysisId(analysisId: string): Promise<Video[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async createChannelAnalysis(analysis: InsertChannelAnalysis): Promise<ChannelAnalysis> {
    const result = await db.insert(channelAnalyses).values(analysis as any).returning();
    return result[0];
  }

  async getChannelAnalysisByChannelId(channelId: string): Promise<ChannelAnalysis | undefined> {
    const result = await db
      .select()
      .from(channelAnalyses)
      .where(eq(channelAnalyses.channelId, channelId))
      .orderBy(desc(channelAnalyses.createdAt))
      .limit(1);
    return result[0];
  }

  async getAllChannelAnalyses(): Promise<ChannelAnalysis[]> {
    return db.select().from(channelAnalyses).orderBy(desc(channelAnalyses.createdAt));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const result = await db.insert(videos).values(video).returning();
    return result[0];
  }

  async createVideos(videoList: InsertVideo[]): Promise<Video[]> {
    if (videoList.length === 0) return [];
    const result = await db.insert(videos).values(videoList).returning();
    return result;
  }

  async getVideosByAnalysisId(analysisId: string): Promise<Video[]> {
    return db
      .select()
      .from(videos)
      .where(eq(videos.analysisId, analysisId))
      .orderBy(desc(videos.viewCount));
  }

  async getTopVideosByAnalysisId(analysisId: string): Promise<Video[]> {
    return db
      .select()
      .from(videos)
      .where(eq(videos.analysisId, analysisId))
      .orderBy(desc(videos.viewCount))
      .limit(5);
  }
}

export const storage = new DatabaseStorage();
