import { ShieldCheck, Sparkles, Truck, Undo2 } from 'lucide-react';

const trustPoints = [
  { icon: ShieldCheck, text: "Plata 925 Certificada" },
  { icon: Sparkles, text: "Hecho a mano" },
  { icon: Truck, text: "Envío Express" },
  { icon: Undo2, text: "30 días para cambiarlo" },
];

const TrustBar = () => {
  return (
    <section className="bg-off-white border-y border-carbon/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center h-24 content-center">
          {trustPoints.map((point, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-center justify-center gap-2 text-carbon">
              <point.icon className="w-6 h-6 text-carbon/80" />
              <span className="text-sm font-semibold">{point.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;