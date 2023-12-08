export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          KilledFast was built by{" "}
          <a
            href="https://twitter.com/leandrodragani"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            @leandrodragani
          </a>
        </p>
      </div>
    </footer>
  );
}
