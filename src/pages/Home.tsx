import { Link } from "react-router-dom";
import LoginBtn from "../component/shared/LoginBtn";

import { featuresList } from "../data-types/data";

import { MoveRightIcon } from "../component/icons/Icons";

export default function Home() {
  return (
    <main className="container flex flex-col gap-4 self-center md:flex-row *:md:flex-1">
      <section className="gap-sm flex flex-col justify-between text-center text-balance md:text-left">
        <h1 className="heading-h1">Marginalia</h1>

        <p className="text-xl leading-tight font-bold md:text-3xl">
          Where every book you read
          <span className="text-primary"> becomes a part of you.</span>
        </p>

        <p className="mx-auto max-w-2xl text-base md:text-lg">
          Have you ever wondered where that brilliant idea you read yesterday
          went? Marginalia is your smart digital reading diary for notes,
          questions, and pacing.
        </p>

        <div className="gap-base flex min-h-20 flex-col items-center justify-around *:w-1/2 *:justify-center md:flex-row *:md:w-1/4">
          <LoginBtn />

          <Link
            to={"/library"}
            className="btn-icon btn btn-outline stroke-muted hover:text-foreground hover:stroke-foreground"
            aria-label="click to move to Library page"
          >
            Library <MoveRightIcon />
          </Link>
        </div>
      </section>
      <section className="gap-sm flex flex-col">
        <h2 className="heading-h2">WHY MARGINALIA?</h2>

        <div className="gap-base flex flex-col flex-wrap *:w-full">
          {featuresList.map((feature) => (
            <article key={feature.id} className="card-style">
              <h3 className="heading-h3">
                {feature.icon()} {feature.title}
              </h3>
              <p className="text-balance">{feature.paragraph}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
