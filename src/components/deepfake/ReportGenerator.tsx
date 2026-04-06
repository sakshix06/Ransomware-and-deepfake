
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import type { AnalysisResultData } from './AnalysisResults';

interface ReportGeneratorProps {
  result: AnalysisResultData;
  fileName: string;
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ result, fileName, onClose }) => {
  const handleDownload = () => {
    const timestamp = new Date().toISOString();
    const formattedTimestamp = timestamp.replace(/:/g, '-').replace(/\..+/, '');
    const reportName = 'deepfake-report-' + formattedTimestamp + '.txt';
    
    const resultStatus = result.isDeepfake ? 'Deepfake (Manipulated)' : 'Authentic (Real)';
    const breakdown = result.confidenceBreakdown 
      ? result.confidenceBreakdown.map(b => '- ' + b.factor + ': ' + b.score + '%').join('\n') 
      : 'N/A';
    const tags = result.fakePatternTags ? result.fakePatternTags.join(', ') : 'None';
    
    const reportContent = "=========================================\n" +
      "      DEEPFAKE DETECTION REPORT\n" +
      "=========================================\n\n" +
      "Timestamp: " + timestamp + "\n" +
      "File Name: " + fileName + "\n\n" +
      "-----------------------------------------\n" +
      "1. OVERALL RESULT\n" +
      "-----------------------------------------\n" +
      "Classification: " + resultStatus + "\n" +
      "Confidence Score: " + result.confidenceScore + "%\n\n" +
      "-----------------------------------------\n" +
      "2. CONFIDENCE BREAKDOWN\n" +
      "-----------------------------------------\n" +
      breakdown + "\n\n" +
      "-----------------------------------------\n" +
      "3. PATTERN TAGS & MARKERS\n" +
      "-----------------------------------------\n" +
      "Detected Tags: " + tags + "\n" +
      "Total Markers: " + result.markers.length + "\n\n" +
      "-----------------------------------------\n" +
      "4. AI EXPLANATION\n" +
      "-----------------------------------------\n" +
      (result.aiExplanation || 'No AI explanation available.') + "\n" +
      "=========================================";

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = reportName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Report downloaded successfully!');
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <Card className="bg-gray-900 border border-gray-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Deepfake Analysis Report</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gray-800 rounded-md">
          <h3 className="text-lg font-medium">Report Summary</h3>
          <p className="mt-2 text-gray-300">
            This report provides a detailed analysis of the media file "{fileName}" 
            to determine if it contains artificially generated or manipulated content.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Analysis Results</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800 rounded-md">
              <p className="text-sm text-gray-400">Confidence Score</p>
              <p className="text-xl font-bold">{result.confidenceScore}%</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-md">
              <p className="text-sm text-gray-400">Classification</p>
              <p className="text-xl font-bold">{result.isDeepfake ? 'Deepfake' : 'Authentic'}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-md">
              <p className="text-sm text-gray-400">Media Type</p>
              <p className="text-xl font-bold capitalize">{result.mediaType}</p>
            </div>
            <div className="p-3 bg-gray-800 rounded-md">
              <p className="text-sm text-gray-400">Detection Markers</p>
              <p className="text-xl font-bold">{result.markers.length}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Detection Markers</h3>
          <div className="space-y-3">
            {result.markers.map((marker, i) => (
              <div key={i} className="p-3 bg-gray-800 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">{marker.name}</span>
                  <span className="text-xs px-2 py-1 bg-opacity-20 rounded-full capitalize" 
                    style={{
                      backgroundColor: marker.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 
                                      marker.severity === 'medium' ? 'rgba(249, 115, 22, 0.2)' : 
                                      'rgba(234, 179, 8, 0.2)',
                      color: marker.severity === 'high' ? 'rgb(239, 68, 68)' : 
                            marker.severity === 'medium' ? 'rgb(249, 115, 22)' : 
                            'rgb(234, 179, 8)'
                    }}>
                    {marker.severity}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-400">{marker.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">DeepSeek Protection Recommendations</h3>
          <div className="p-3 bg-gray-800 rounded-md">
            <ul className="space-y-2">
              {result.protectionRecommendations.map((recommendation, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>{i + 1}.</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-ransomguard-purple hover:bg-ransomguard-deep-purple"
        >
          <Download size={18} />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportGenerator;
