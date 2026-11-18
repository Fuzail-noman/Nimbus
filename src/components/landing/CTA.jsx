import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FloatingBlobs, Reveal, scaleIn } from '../../animations';

export default function CTA() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28">
      <Reveal variants={scaleIn} className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white sm:py-24">
        <FloatingBlobs className="opacity-60" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-4xl font-extrabold sm:text-5xl">Give your team a calmer way to ship.</h2>
          <p className="mx-auto mt-4 max-w-md text-white/65">Join thousands of teams planning smarter with Nimbus. Free to start, no card required.</p>
          <Link to="/register" className="btn btn-primary mt-9 !px-8 !py-3.5 text-base">
            Create your free account <ArrowRight size={18} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
