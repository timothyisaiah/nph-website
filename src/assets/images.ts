import { generatedImages } from './generated/image-manifest';
import type { ResponsiveImageAsset } from './image-types';

export type ImageAsset = ResponsiveImageAsset & { url: string };

const image = (asset: ResponsiveImageAsset): ImageAsset => ({
  ...asset,
  url: asset.fallback.src,
});

const hero = image(generatedImages.hero);
const about = image(generatedImages.about);
const healthcareTeam = image(generatedImages.healthcareTeam);
const community = image(generatedImages.community);
const laboratory = image(generatedImages.laboratory);
const dataAnalysis = image(generatedImages.dataAnalysis);
const communityHealth = image(generatedImages.communityHealth);

export const images = {
  hero,
  about,
  services: healthcareTeam,
  research: healthcareTeam,
  community,
  dataAnalysis,
  publicHealthResearch: laboratory,
  healthSystems: healthcareTeam,
  communityHealth,
  consulting: laboratory,
  training: about,
  monitoring: image(generatedImages.monitoring),
  healthAndEnvironment: image(generatedImages.healthAndEnvironment),
  politicalEconomy: image(generatedImages.politicalEconomy),
  publicHealth: image(generatedImages.publicHealth),
  companyLogo: image(generatedImages.companyLogo),
  charts: {
    mddEastAfrica: image(generatedImages.mddEastAfrica),
    violenceAgainstWomen: image(generatedImages.violenceAgainstWomen),
    under5Mortality: image(generatedImages.under5Mortality),
    fertilityRate: image(generatedImages.fertilityRate),
    severeWastingMaternalEducation: image(generatedImages.severeWastingMaternalEducation),
    severeWastingChildren: image(generatedImages.severeWastingChildren),
    severeWastingInfants: image(generatedImages.severeWastingInfants),
    severeAnaemia: image(generatedImages.severeAnaemia),
    openDefecation: image(generatedImages.openDefecation),
    obesity: image(generatedImages.obesity),
    neonatalMortality: image(generatedImages.neonatalMortality),
    mtct: image(generatedImages.mtct),
    medianAgeSexualIntercourse: image(generatedImages.medianAgeSexualIntercourse),
    itn: image(generatedImages.itn),
    fgm: image(generatedImages.fgm),
    facilityBirths: image(generatedImages.facilityBirths),
    exclusiveBreastfeeding: image(generatedImages.exclusiveBreastfeeding),
    electricity: image(generatedImages.electricity),
    womenEducation: image(generatedImages.womenEducation),
    pregnancyDeath: image(generatedImages.pregnancyDeath),
    csUganda: image(generatedImages.csUganda),
    csSsa: image(generatedImages.csSsa),
    contraceptiveMethods: image(generatedImages.contraceptiveMethods),
    bottleFeeding: image(generatedImages.bottleFeeding),
    basicAntigens: image(generatedImages.basicAntigens),
  },
} as const;

export type { ResponsiveImageAsset } from './image-types';
