import { Hero } from "@/components/hero/Hero";
import { ProfileIntro } from "@/components/sections/ProfileIntro";
import { Pillars } from "@/components/sections/Pillars";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ApproachFlow } from "@/components/sections/ApproachFlow";
import { ExperienceStrip } from "@/components/sections/ExperienceStrip";
import { ContactBlock } from "@/components/sections/ContactBlock";

export default function Home() {
  return (
    <>
      <Hero />
      <ProfileIntro />
      <Pillars />
      <FeaturedWork />
      <ApproachFlow />
      <ExperienceStrip />
      <ContactBlock />
    </>
  );
}
