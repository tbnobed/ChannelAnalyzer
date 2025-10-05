import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ChannelInputFormProps {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
}

export function ChannelInputForm({ onAnalyze, isLoading = false }: ChannelInputFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            YouTube Channel Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Get AI-powered insights, revenue estimates, and growth predictions for any YouTube channel
          </p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="channel-url" className="text-sm font-medium">
                YouTube Channel URL
              </label>
              <Input
                id="channel-url"
                type="text"
                placeholder="https://youtube.com/@channelname or https://youtube.com/channel/UCxxxxx"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="px-4 py-3 text-base"
                data-testid="input-channel-url"
              />
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto md:px-8"
              disabled={isLoading || !url.trim()}
              data-testid="button-analyze"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Channel"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
