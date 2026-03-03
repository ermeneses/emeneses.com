import type { Metadata } from "next";
import Image from "next/image";
import { Github, Link2, Linkedin, Mail, Phone, Twitter } from "lucide-react";
import cv from "@/data/cv.json";
import CommandPalette from "@/components/command-palette";
import styles from "./page.module.css";

const { basics, work, education, projects, skills } = cv;

const linkedin = basics.profiles.find((profile) => profile.network === "LinkedIn");
const github = basics.profiles.find((profile) => profile.network === "GitHub");
const printInfo = [basics.email, basics.phone, linkedin?.url].filter(Boolean).join(" • ");

const SOCIAL_TAGS: Record<string, string> = {
  LinkedIn: "in",
  X: "X",
  GitHub: "GH",
};

const SOCIAL_ICONS = {
  LinkedIn: Linkedin,
  X: Twitter,
  GitHub: Github,
} as const;

const paletteCommands = [
  {
    id: "print",
    section: "Acciones",
    title: "Imprimir",
    hotkey: "ctrl+p",
    icon: "⎙",
    action: "print" as const,
  },
  ...basics.profiles.map((profile) => ({
    id: profile.network,
    section: "Social",
    title: `Visitar ${profile.network}`,
    url: profile.url,
    icon: SOCIAL_TAGS[profile.network] ?? profile.network.slice(0, 2).toUpperCase(),
    hotkey: `ctrl+${profile.network[0]?.toLowerCase() ?? "k"}`,
  })),
];

const getYear = (date: string | null) => {
  if (!date) return "Actual";
  const year = new Date(date).getFullYear();
  return Number.isNaN(year) ? "Actual" : String(year);
};

const formatPeriod = (startDate: string, endDate: string | null) => {
  return `${getYear(startDate)} - ${getYear(endDate)}`;
};

const githubUsername = github?.url
  ?.replace("https://github.com/", "")
  ?.replace("http://github.com/", "")
  ?.replace(/\/$/, "");

const githubChartColor = "111111";
const githubChartUrl = githubUsername
  ? `https://ghchart.rshah.org/${githubChartColor}/${githubUsername}`
  : null;

export const metadata: Metadata = {
  title: `Portafolio de ${basics.name} - ${basics.label}`,
  description: basics.summary,
};

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}

export default function Page() {
  return (
    <>
      <main className={styles.main}>
        <Section>
          <div className={styles.hero}>
            <div className={styles.info}>
              <h1>{basics.name}</h1>
              <h2>{basics.label}</h2>
              <span className={styles.location}>
                {basics.location.city}, {basics.location.region}
              </span>

              <footer className={styles.print}>{printInfo}</footer>

              <footer className={styles.socials}>
                <a href={`mailto:${basics.email}`} title={`Enviar correo a ${basics.name}`}>
                  <Mail className={styles.socialIcon} aria-hidden="true" />
                </a>
                <a href={`tel:${basics.phone}`} title={`Llamar a ${basics.name}`}>
                  <Phone className={styles.socialIcon} aria-hidden="true" />
                </a>
                {basics.profiles.map((profile) => {
                  const Icon = SOCIAL_ICONS[profile.network as keyof typeof SOCIAL_ICONS] ?? Link2;

                  return (
                    <a
                      key={profile.network}
                      href={profile.url}
                      title={`Visitar ${profile.network}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className={styles.socialIcon} aria-hidden="true" />
                    </a>
                  );
                })}
              </footer>
            </div>

            <figure className={styles.avatarWrap}>
              <Image
                src={basics.image}
                alt={basics.name}
                width={128}
                height={128}
                priority
                className={styles.avatar}
              />
            </figure>
          </div>
        </Section>

        <Section title="Sobre mí">
          <p>{basics.summary}</p>
        </Section>

        <Section title="Experiencia laboral">
          <ul className={styles.list}>
            {work.map((job) => (
              <li key={`${job.name}-${job.startDate}`}>
                <article>
                  <header className={styles.rowHeader}>
                    <div>
                      <h3>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          {job.name}
                        </a>
                      </h3>
                      <h4>{job.position}</h4>
                    </div>
                    <time>{formatPeriod(job.startDate, job.endDate)}</time>
                  </header>
                  <footer>
                    <p>{job.summary}</p>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Educación">
          <ul className={styles.list}>
            {education.map((item) => (
              <li key={`${item.institution}-${item.startDate}`}>
                <article>
                  <header className={styles.rowHeader}>
                    <div>
                      <h3>{item.institution}</h3>
                    </div>
                    <time>{formatPeriod(item.startDate, item.endDate)}</time>
                  </header>
                  <footer>
                    <p>{item.area}</p>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Proyectos">
          <ul className={styles.projects}>
            {projects.map((project) => (
              <li key={project.name}>
                <article className={styles.projectCard}>
                  <header>
                    <h3>
                      <a href={project.url} target="_blank" rel="noopener noreferrer">
                        {project.name}
                      </a>
                      {project.isActive ? <span className={styles.activeDot}> • </span> : null}
                      {project.github ? (
                        <a
                          className={styles.githubLink}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Código de ${project.name}`}
                        >
                          GH
                        </a>
                      ) : null}
                    </h3>
                    <p>{project.description}</p>
                  </header>

                  <footer className={styles.tags}>
                    {project.highlights.map((highlight) => (
                      <span key={`${project.name}-${highlight}`}>{highlight}</span>
                    ))}
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Habilidades">
          <ul className={styles.skills}>
            {skills.map((skill) => (
              <li key={skill.name}>{skill.name}</li>
            ))}
          </ul>
        </Section>

        {github && githubChartUrl ? (
          <Section title="Contribuciones GitHub">
            <a
              className={styles.githubWidgetLink}
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver perfil de GitHub"
            >
              <object
                className={styles.githubWidget}
                type="image/svg+xml"
                data={githubChartUrl}
                aria-label={`Gráfico de contribuciones de ${githubUsername}`}
              >
                <p>No se pudo cargar el widget de contribuciones.</p>
              </object>
            </a>
          </Section>
        ) : null}
      </main>

      <CommandPalette commands={paletteCommands} />
    </>
  );
}
