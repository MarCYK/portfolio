import { GUIShell } from '@/components/GUIShell';
import { HeroSection } from '@/components/HeroSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ProjectsList } from '@/components/ProjectsList';
import { ContactSection } from '@/components/ContactSection';

export default function Home() {
  return (
    <GUIShell>
      <HeroSection />
      <SkillsSection />
      <ProjectsList />
      <ContactSection />
    </GUIShell>
  );
}
