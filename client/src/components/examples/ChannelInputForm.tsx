import { ChannelInputForm } from "../ChannelInputForm";

export default function ChannelInputFormExample() {
  return (
    <ChannelInputForm
      onAnalyze={(url) => console.log("Analyzing:", url)}
      isLoading={false}
    />
  );
}
