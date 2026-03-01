import { Badge } from '@/shared/components/ui/badge';
import { Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/components/ui/dialog';
import type { IncidentImage } from '@/features/incidents/incident-detail/constants/incidentDetail.types';

export const VisualCard = ({ img, index }: { img: IncidentImage; index: number }) => (
    <Dialog key={img.id}>
        <DialogTrigger asChild>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02] cursor-pointer"
            >
                <img src={img.url} className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110" alt="Evidence" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/10 text-[8px] font-mono text-primary py-1 px-3">
                            CAM_ID: {img.id.slice(0, 8)}
                        </Badge>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[8px] font-mono text-white/40 uppercase">REC_LIVE</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest">{img.description}</p>
                            <div className="flex items-center gap-3">
                                <p className="text-[9px] font-mono text-white/40">{img.timestamp.toLocaleTimeString()}</p>
                                <span className="text-[8px] font-mono text-primary/40">F: 1.8 | ISO: 400</span>
                            </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                            <Maximize2 size={16} />
                        </motion.div>
                    </div>
                </div>

                {/* CORNER ACCENTS */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] h-[90vh] bg-[#0A0E17]/95 border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
            <img src={img.url} className="w-full h-full object-contain" />
        </DialogContent>
    </Dialog>
);
