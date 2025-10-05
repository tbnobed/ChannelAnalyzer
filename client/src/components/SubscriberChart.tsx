import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SubscriberChartProps {
  data: number[];
  labels: string[];
}

export function SubscriberChart({ data, labels }: SubscriberChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Subscribers",
        data,
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsl(var(--chart-1) / 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "hsl(var(--chart-1))",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          font: {
            family: "var(--font-sans)",
            size: 14,
          },
          color: "hsl(var(--muted-foreground))",
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--card))",
        titleColor: "hsl(var(--card-foreground))",
        bodyColor: "hsl(var(--card-foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "hsl(var(--border) / 0.4)",
          drawBorder: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 12,
          },
          callback: function (value: any) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + "K";
            }
            return value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Subscriber Growth</h3>
      <div data-testid="chart-subscriber-growth">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
