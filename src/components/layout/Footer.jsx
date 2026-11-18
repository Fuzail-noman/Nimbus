import Logo from '../ui/Logo';

const columns = [
  { title: 'Product', links: [['Features', '/#features'], ['How it works', '/#how'], ['Pricing', '/#pricing']] },
  { title: 'Company', links: [['About', '/#'], ['Careers', '/#'], ['Contact', '/#']] },
  { title: 'Resources', links: [['Help centre', '/#faq'], ['Changelog', '/#'], ['Status', '/#']] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            The project workspace where teams plan, track and ship work together.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-muted transition hover:text-accent">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Nimbus. All rights reserved.</p>
          <p>Built with the MERN stack.</p>
        </div>
      </div>
    </footer>
  );
}
