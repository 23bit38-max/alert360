import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTheme, GlobalStyles } from '../../theme';

import { Zap, Save, RotateCcw, Activity, Database } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export const SystemSettings = () => {
  const { colors, typography } = useTheme();

  const [yoloSettings] = useState({
    confidence: 0.75,
    detectionInterval: 2,
    batchSize: 4,
    gpuAcceleration: true,
    modelVersion: 'v8n'
  });

  return (
    <div style={GlobalStyles.pageContainer}>
      {/* Configuration Control Bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Engine Config: </span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Neural Network v8.4</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 px-4 rounded-xl glass border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest">
            <RotateCcw size={14} className="mr-2 opacity-50" /> Reset
          </Button>
          <Button className="h-10 px-6 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.2)]">
            <Save size={14} className="mr-2" /> Commit Changes
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'AI Engine', status: 'SYNCHRONIZED', icon: Zap, color: colors.status.safe.main },
          { label: 'Data Stream', status: 'ENCRYPTED', icon: Database, color: colors.status.safe.main },
          { label: 'Node Health', status: 'OPTIMAL', icon: Activity, color: colors.status.safe.main },
        ].map((item, i) => (
          <Card key={i} style={GlobalStyles.card}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p style={typography.caption}>{item.label}</p>
                <p style={{ ...typography.body, fontWeight: '900', color: item.color }}>{item.status}</p>
              </div>
              <div style={{ color: item.color }}><item.icon size={28} /></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="yolo" className="space-y-6">
        <TabsList className="bg-transparent border-b p-0 h-auto rounded-none w-full flex justify-start mb-6" style={{ borderColor: colors.background.border }}>
          {['yolo', 'alerts', 'security'].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              style={{
                backgroundColor: 'transparent',
                borderBottom: '2px solid transparent',
                color: colors.text.muted,
                borderRadius: 0,
                padding: '12px 24px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}
              className="data-[state=active]:border-b-indigo-500 data-[state=active]:text-white"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="yolo">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card style={{ ...GlobalStyles.card, gridColumn: 'span 8' }}>
              <CardHeader><CardTitle style={typography.label}>NEURAL ENGINE PARAMETERS</CardTitle></CardHeader>
              <CardContent className="space-y-8 p-6">
                <div className="space-y-4">
                  <Label style={typography.caption}>CONFIDENCE THRESHOLD (DETECTION)</Label>
                  <Slider
                    value={[yoloSettings.confidence]}
                    max={1} min={0.1} step={0.05}
                    className="py-4"
                  />
                  <div className="flex justify-between" style={typography.caption}>
                    <span>SENSITIVE</span>
                    <span style={{ color: colors.accent.primary }}>{yoloSettings.confidence.toFixed(2)}</span>
                    <span>STRICT</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label style={typography.caption}>PROCESSING INTERVAL (SEC)</Label>
                    <Input type="number" defaultValue={2} style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }} />
                  </div>
                  <div className="space-y-2">
                    <Label style={typography.caption}>ENGINE ARCHITECTURE</Label>
                    <Select defaultValue="v8n">
                      <SelectTrigger style={{ backgroundColor: colors.background.app, borderColor: colors.background.border }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: colors.background.sidebar, borderColor: colors.background.border }}>
                        <SelectItem value="v8n">YOLOv8 Nano (Speed Optimized)</SelectItem>
                        <SelectItem value="v8s">YOLOv8 Small (Balanced)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card style={{ ...GlobalStyles.card, gridColumn: 'span 4' }}>
              <CardHeader><CardTitle style={typography.label}>HARDWARE ACCELERATION</CardTitle></CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ ...typography.body, fontWeight: '700' }}>CUDA Support</p>
                    <p style={typography.caption}>Use GPU cores for inference</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <Separator style={{ backgroundColor: colors.background.border }} />
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background.app }}>
                  <p style={{ ...typography.caption, color: colors.text.muted }}>CURRENT LOAD</p>
                  <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[42%]" />
                  </div>
                  <p className="mt-2" style={{ ...typography.caption, color: colors.status.safe.main }}>42% GPU UTILIZATION</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Separator = ({ style }: { style: any }) => <div style={{ height: '1px', width: '100%', ...style }} />;