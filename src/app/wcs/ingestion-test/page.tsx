"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockItem,
} from "@/components/ui/code-block";
import type { BundledLanguage } from "@/components/ui/code-block";

const defaultPayload = {
  video_source_url: "https://cdn.wcspartner.com/highlights/wcs_highlight__provider_clip_id=goal_martinez_73min&opta_match_id=2713631&opta_event_id=g2713631evt1847&opta_competition_id=2kxe4ya1n89b0iuvjpjte5o4p.mp4",
  thumbnail_source_url: "https://cdn.wcspartner.com/highlights/wcs_highlight__provider_clip_id=goal_martinez_73min&opta_match_id=2713631&opta_event_id=g2713631evt1847&opta_competition_id=2kxe4ya1n89b0iuvjpjte5o4p.jpg"
};

const PARTNER_SECRET = "d4f3127fa0c977e2b52cf59a0fa8f962ee2d94a3e120f12aac5dbed6cf4b91e0";
const API_ENDPOINT = "/api/wcs/ingest";

export default function WCSIngestionTest() {
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2));
  const [response, setResponse] = useState<{ data?: { video_url?: string; thumbnail_url?: string }; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleSubmit = async () => {
    setLoading(true);
    setResponse(null);

    try {
      const parsedPayload = JSON.parse(payload);
      
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-partner-secret": PARTNER_SECRET,
        },
        body: JSON.stringify(parsedPayload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        toast.error(`Error ${res.status}: ${data.error || "Unknown error"}`);
        setResponse(data);
      } else {
        toast.success("Highlight ingested successfully!");
        setResponse(data);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON in payload");
      } else {
        toast.error(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const curlCommand = `curl -X POST ${typeof window !== 'undefined' ? window.location.origin : ''}${API_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -H "x-partner-secret: ${PARTNER_SECRET}" \\
  -d '${JSON.stringify(defaultPayload, null, 2)}'`;

  const curlCodeData = [
    {
      language: 'bash',
      filename: 'curl',
      code: curlCommand,
    },
  ];

  const exampleResponseCode = JSON.stringify({
    data: {
      id: 123,
      provider: "partner",
      provider_id: "goal_martinez_73min",
      opta_match_id: "2713631",
      opta_competition_id: "2kxe4ya1n89b0iuvjpjte5o4p",
      opta_event_id: "g2713631evt1847",
      video_url: "https://aucusaxsdyrwmwpxhpgl.supabase.co/storage/v1/object/public/match-highlights/clips/goal_martinez_73min.mp4",
      thumbnail_url: "https://aucusaxsdyrwmwpxhpgl.supabase.co/storage/v1/object/public/match-highlights/thumbs/goal_martinez_73min.jpg",
      status: "ready",
      created_at: "2025-12-05T10:30:00.000Z",
      updated_at: "2025-12-05T10:30:00"
    }
  }, null, 2);

  const responseCodeData = [
    {
      language: 'json',
      filename: 'response.json',
      code: exampleResponseCode,
    },
  ];

  const filenameExamples = [
    {
      type: "Goal",
      filename: "wcs_highlight__provider_clip_id=goal_santos_12min&opta_match_id=2713631&opta_event_id=g2713631evt0412&opta_competition_id=2kxe4ya1n89b0iuvjpjte5o4p.mp4"
    },
    {
      type: "Red Card",
      filename: "wcs_highlight__provider_clip_id=redcard_johnson_45min&opta_match_id=2713631&opta_event_id=g2713631evt0891&opta_competition_id=2kxe4ya1n89b0iuvjpjte5o4p.mp4"
    },
    {
      type: "Save",
      filename: "wcs_highlight__provider_clip_id=save_keeper_88min&opta_match_id=2713631&opta_event_id=g2713631evt1203&opta_competition_id=2kxe4ya1n89b0iuvjpjte5o4p.mp4"
    },
  ];

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">WCS Media Ingestion API</h1>
        <p className="text-muted-foreground">
          Test highlight integration with the highlight ingestion endpoint
        </p>
      </div>

      <Tabs defaultValue="test" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger variant="underline" value="test">Test Endpoint</TabsTrigger>
          <TabsTrigger variant="underline" value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Payload</CardTitle>
                <CardDescription>
                  Edit the JSON payload to test your integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  className="w-full h-96 p-4 font-mono text-sm border rounded-md bg-slate-50 dark:bg-slate-900"
                  spellCheck={false}
                />
                
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Processing..." : "Submit to API"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Response</CardTitle>
                <CardDescription>
                  Response from the ingestion endpoint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 p-4 border rounded-md bg-slate-50 dark:bg-slate-900 overflow-auto">
                  {response ? (
                    <div className="space-y-4">
                      {response.data && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-green-600 text-white rounded">
                          Success
                        </span>
                      )}
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Response will appear here after submission
                    </p>
                  )}
                </div>

                {response?.data && (
                  <div className="mt-4 space-y-3 pt-4 border-t">
                    <h3 className="font-medium text-sm">Media URLs:</h3>
                    {response.data.video_url && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Video:</p>
                        <a
                          href={response.data.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline break-all block"
                        >
                          {response.data.video_url}
                        </a>
                      </div>
                    )}
                    {response.data.thumbnail_url && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Thumbnail:</p>
                        <a
                          href={response.data.thumbnail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline break-all block"
                        >
                          {response.data.thumbnail_url}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <div>
                    <p className="text-sm font-medium mb-1">Production Endpoint</p>
                    <code className="text-xs">POST {typeof window !== 'undefined' ? window.location.origin : ''}{API_ENDPOINT}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`${typeof window !== 'undefined' ? window.location.origin : ''}${API_ENDPOINT}`, 'endpoint')}
                  >
                    {copiedStates['endpoint'] ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">Partner Secret</p>
                    <code className="text-xs font-mono break-all">{PARTNER_SECRET}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(PARTNER_SECRET, 'secret')}
                    className="ml-2 flex-shrink-0"
                  >
                    {copiedStates['secret'] ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Required Headers</h3>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md font-mono text-sm space-y-1">
                  <div><span className="text-muted-foreground">Content-Type:</span> application/json</div>
                  <div><span className="text-muted-foreground">x-partner-secret:</span> {PARTNER_SECRET}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Required Fields</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="inline-block px-2 py-1 text-xs bg-secondary text-background rounded h-fit">URL</span>
                    <div>
                      <code className="text-xs font-semibold">video_source_url</code>
                      <p className="text-muted-foreground text-xs mt-1">Publicly accessible URL to download the video file. Metadata is encoded in the filename.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="inline-block px-2 py-1 text-xs bg-secondary text-background rounded h-fit">URL</span>
                    <div>
                      <code className="text-xs font-semibold">thumbnail_source_url</code>
                      <p className="text-muted-foreground text-xs mt-1">Publicly accessible URL to download the thumbnail image</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Filename Convention</CardTitle>
              <CardDescription>
                Metadata is encoded directly in the video filename using URL parameter style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Format</h3>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md font-mono text-xs break-all">
                  wcs_highlight__provider_clip_id=&#123;clip_id&#125;&opta_match_id=&#123;match_id&#125;&opta_event_id=&#123;event_id&#125;&opta_competition_id=&#123;competition_id&#125;.mp4
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Required Metadata Parameters</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <span className="inline-block px-2 py-1 text-xs bg-secondary text-background rounded h-fit">String</span>
                    <div>
                      <code className="text-xs font-semibold">provider_clip_id</code>
                      <p className="text-muted-foreground text-xs mt-1">Unique identifier for the clip from your system</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="inline-block px-2 py-1 text-xs bg-secondary text-background rounded h-fit">String</span>
                    <div>
                      <code className="text-xs font-semibold">opta_match_id</code>
                      <p className="text-muted-foreground text-xs mt-1">Opta match identifier</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="inline-block px-2 py-1 text-xs bg-secondary text-background rounded h-fit">String</span>
                    <div>
                      <code className="text-xs font-semibold">opta_event_id</code>
                      <p className="text-muted-foreground text-xs mt-1">Opta event identifier</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="inline-block px-2 py-1 text-xs bg-secondary text-background rounded h-fit">String</span>
                    <div>
                      <code className="text-xs font-semibold">opta_competition_id</code>
                      <p className="text-muted-foreground text-xs mt-1">Opta competition identifier</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Example Filenames</h3>
                <div className="space-y-2">
                  {filenameExamples.map((example) => (
                    <div key={example.type} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                      <p className="text-xs font-medium mb-1">{example.type}</p>
                      <code className="text-xs text-muted-foreground break-all">{example.filename}</code>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium mb-1">Maximum Video Size</dt>
                  <dd className="text-muted-foreground">50 GB</dd>
                </div>
                <div>
                  <dt className="font-medium mb-1">Request Timeout</dt>
                  <dd className="text-muted-foreground">5 minutes (300 seconds)</dd>
                </div>
                <div>
                  <dt className="font-medium mb-1">Supported Video Formats</dt>
                  <dd className="text-muted-foreground">MP4, MOV, MKV, WebM, MPG, MPEG, M4V</dd>
                </div>
                <div>
                  <dt className="font-medium mb-1">Supported Image Formats</dt>
                  <dd className="text-muted-foreground">JPG, JPEG, PNG, WebP, GIF</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Request</CardTitle>
              <CardDescription>Copy this cURL command to test from your terminal</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock data={curlCodeData} defaultValue="bash">
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem key={item.language} value={item.language}>
                      <CodeBlockContent language={item.language as BundledLanguage}>
                        {item.code}
                      </CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => copyToClipboard(curlCommand, 'curl')}
              >
                {copiedStates['curl'] ? 'Copied!' : 'Copy cURL Command'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example Response</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock data={responseCodeData} defaultValue="json">
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem key={item.language} value={item.language}>
                      <CodeBlockContent language={item.language as BundledLanguage}>
                        {item.code}
                      </CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                If you need help, text 3392227451
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
