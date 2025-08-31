import { images } from '../assets/images';

export interface DataBrief {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  fullContent: string;
  chartImage: string;
  docxFile: string;
}

export const dataBriefs: DataBrief[] = [
  {
    id: 'mdd-east-africa-2025',
    title: 'Why millions of infants and young children in East Africa are vulnerable to malnutrition and its lifelong consequences',
    date: 'Aug 17, 2025',
    author: 'Joseph Kyanjo',
    category: 'Nutrition',
    excerpt: 'The first 1,000 days of life are a critical window for child growth, brain development, and future health. Nutrition during this period not only determines survival but also lays the foundation for learning and future productivity. Poor diets in infancy are strongly linked to stunting, micronutrient deficiencies, and illness.',
    fullContent: `The first 1,000 days of life are a critical window for child growth, brain development, and future health. Nutrition during this period not only determines survival but also lays the foundation for learning and future productivity. Poor diets in infancy are strongly linked to stunting, micronutrient deficiencies, and illness. To address this, WHO and UNICEF emphasize the importance of complementary feeding, the process of introducing foods and beverages alongside continued breastfeeding from six months onward. A central indicator is the Minimum Dietary Diversity (MDD), which requires children 6–23 months to consume at least five of eight defined food groups in a day for healthy growth and development.

Yet, the latest data from East Africa highlight a worrying picture. Even in Kenya, the best-performing country, only 37 percent of children aged 6–23 months achieve minimum dietary diversity. At the other end of the spectrum, the Democratic Republic of Congo records just 17 percent. This means that most children in the region are not receiving the diversity of foods essential for their growth and development, leaving millions vulnerable to malnutrition and its lifelong consequences.`,
    chartImage: '/databriefs/MDD in East Africa 17082025 chart.png',
    docxFile: 'MDD in East Africa 17082025 story.docx'
  },
  {
    id: 'wood-based-biomass-2025',
    title: 'Wood-based bio mass remains the main source of cooking energy used by households in Uganda',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Energy & Environment',
    excerpt: 'The World Bank estimates that 81 percent of SSA households rely on wood-based biomass energy (fuel wood and charcoal) for cooking. Further reports by the African Renewable Energy Access Program show that annually, nearly 600,000 Africans die and millions more suffer from chronic illnesses caused by air pollution from inefficient and dangerous traditional cooking fuels and stoves.',
    fullContent: `The World Bank estimates that 81 percent of SSA households rely on wood-based biomass energy (fuel wood and charcoal) for cooking. Further reports by the African Renewable Energy Access Program show that annually, nearly 600,000 Africans die and millions more suffer from chronic illnesses caused by air pollution from inefficient and dangerous traditional cooking fuels and stoves. This public health crisis not only disproportionately harms women and children especially in SSA but also contributes to a wide range of negative environmental and climate change effects. 

The World Bank's Africa Clean Cooking Energy Solutions (ACCES) initiative seeks for a turning point in Africa's cooking sector to a much broader uptake of cleaner efficient fuels and renewable energy. However, for Uganda, access to electricity is not expected to replace wood-based fuel use for cooking soon because the cost of cooking using electricity or liquefied petroleum gas (LPG) is often prohibitive.`,
    chartImage: images.dataAnalysis.url,
    docxFile: 'Wood based mass.docx'
  },
  {
    id: 'women-education-ssa-2025',
    title: 'Notable strides have been made towards education women yet more work still needs to be done in SSA',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Education',
    excerpt: 'Sustainable Development Goal 4 commits that all girls and boys complete free, equitable and quality primary and secondary education. This is because the latter equips learners with the knowledge and skills needed to transition successfully into adulthood.',
    fullContent: `Sustainable Development Goal 4 commits that all girls and boys complete free, equitable and quality primary and secondary education. This is because the latter equips learners with the knowledge and skills needed to transition successfully into adulthood. However, the benefits are far more reaching and significant for girls as a protective factor against child marriage, adolescent pregnancy and malnutrition. Although considerable progress has been made towards gender parity education, equitable education opportunities remain out of reach owing to growing insecurity, violence and threats of violence that girls, especially, face in their quest for education. 

Moreover, in many African countries, women and girls continue to face socio-cultural and economic constraints which are deeply rooted in societal values and norms resulting in attainment of low education levels. This results in a never-ending cycle of unequal land rights and management, restricted access to justice and continued sexual and domestic violence among others. The African proverb "If you educate a man you educate an individual, but if you educate a woman you educate a nation" holds true for intergenerational gains attained from educating women. Despite efforts such as Universal Secondary Education, less than half of women in Uganda have attained secondary or higher education an indication of significantly widening gender gaps in secondary and tertiary education attainment.`,
    chartImage: images.charts.womenEducation.url,
    docxFile: 'women education in SSA.docx'
  },
  {
    id: 'bottle-feeding-ssa-2025',
    title: 'Why feeding of children under 24 months using a bottle with a nipple is not recommended in SSA',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'The WHO organization recommends avoiding feeding children under two years using a bottle with a nipple because it is linked to interference with optimal suckling behaviour and nipples are difficult to keep clean making them a route of transmission of pathogens.',
    fullContent: `The WHO organization recommends avoiding feeding children under two years using a bottle with a nipple because it is linked to interference with optimal suckling behaviour and nipples are difficult to keep clean making them a route of transmission of pathogens. For example, the 2005 "Guiding principles for feeding non-breastfed children 6-24 months of age" report showed that 35 percent of bottle teats in peri-urban Peru tested positive for E. Coli, which is an indicator of faecal contamination. In addition, bottle feeding is associated with the risk of developing incorrect relation between the teeth as well as the risk of overfeeding that is associated with more rapid weight gain during infancy. 

Therefore, a lower percentage of children under two years of age who are using a bottle with a nipple, indicates that the country is closer to WHO recommendations. The most recent data shows that almost 11 percent of Uganda's children below 24 months are fed using a bottle with a nipple. Although this is a relatively low percentage in comparison with South Africa's 45 percent, it is higher than Burundi, the lowest ranking country.`,
    chartImage: images.charts.bottleFeeding.url,
    docxFile: 'Why feeding of children under 24 months using a bottle with a nipple.docx'
  },
  {
    id: 'obesity-uganda-2025',
    title: 'Why the prevalence of obesity in Ugandan females and males is of great public health concern',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Public Health',
    excerpt: 'Diagnosis of obesity is made by measuring one\'s weight and height, then using these to calculate the Body Mass Index (BMI). WHO defines a BMI ≥30 in adults as being obese and in 2022, globally, 16 percent of adults (18 years and older) were living with this heterogeneous condition.',
    fullContent: `Diagnosis of obesity is made by measuring one's weight and height, then using these to calculate the Body Mass Index (BMI). WHO defines a BMI ≥30 in adults as being obese and in 2022, globally, 16 percent of adults (18 years and older) were living with this heterogeneous condition. The significant drivers of obesity are categorized as genetic, lifestyle, environmental and medical factors which can be broken down as: consuming energy-dense foods, sedentary lifestyles, some medications, hormonal imbalances among others. Obesity is notorious for being a predisposing factor of the rapid upsurge of several non-communicable diseases (NCDs) including diabetes and cardiovascular diseases which result in increased health care costs and a reduced quality of life. 

Addressing obesity in Uganda where the country faces a double burden of malnutrition (over and under nutrition) and the population is characterized by widespread poverty, undernutrition and hunger is particularly challenging. This is because the underlying pathways may not be the same among people at either end of the socioeconomic spectrum. Notably, there is a wider prevalence of obesity among women than men in Uganda which in addition to the aforementioned predisposition to NCDs is also a likely cause of reproductive health issues such as menstrual irregularities, infertility obesity and pregnancy complications.`,
    chartImage: images.charts.obesity.url,
    docxFile: 'Why the prevalence of obesity in Ugandan females and males is of great public health concern.docx'
  },
  {
    id: 'under-5-mortality-2025',
    title: 'Under 5 child mortality rates in SSA against the 2030 SDG target of 25 or few deaths per 1000 live births',
    date: 'Aug 22, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'Under-five child mortality rate is the probability that a new-born would die before reaching exactly 5 years of age, expressed per 1,000 live births. UNICEF reported that in 2023, 4.8 million children under 5 years of age died globally.',
    fullContent: `Under-five child mortality rate is the probability that a new-born would die before reaching exactly 5 years of age, expressed per 1,000 live births. UNICEF reported that in 2023, 4.8 million children under 5 years of age died globally and infectious diseases, such as pneumonia, diarrhoea and malaria, preterm birth and intrapartum-related complications remain leading causes. 

Mortality of children under-5 years is a core indicator of the development of families, societies and the world at large and it reflects the macroeconomic and public health priorities and values of a country. With the SDG for under-five mortality rate set at 25 or fewer deaths per 1,000 live births by 2030, the latest data from SSA countries shows that most countries might miss this goal. This implies that even for Gabon with the least deaths of 39 per 1,000 live births, resources and policy must be geared toward not only sustaining current rates of decline but also accelerating progress child survival goals.`,
    chartImage: images.charts.under5Mortality.url,
    docxFile: 'under 5 mortality.docx'
  },
  {
    id: 'caesarean-section-ssa-2025',
    title: 'The prevalence of Caesarean section and its outcomes on maternal health in SSA',
    date: 'Aug 19, 2025',
    author: 'Rachael Nagaddya',
    category: 'Maternal Health',
    excerpt: 'In the pursuit to attain SDG 3 and reduce maternal and/or child mortality, assisted vaginal delivery and safe caesarean section (CS) are remarkably essential. The latter is a life-saving procedure for both mother and child that averts complications during labour and delivery.',
    fullContent: `In the pursuit to attain SDG 3 and reduce maternal and/or child mortality, assisted vaginal delivery and safe caesarean section (CS) are remarkably essential. The latter is a life-saving procedure for both mother and child that averts complications during labour and delivery. However, there is a growing concern that globally, the c-section practice for medical, economic and social reasons is on the rise, regardless of race, age, medical condition and gestational age. 

As such WHO recommended that the c-section prevalence should not surpass 10-15 percent with evidence signifying that c-section prevalence beyond 15 percent is not linked to further reduction in maternal and child morbidity and mortality. In addition, WHO cautions that, birth by c-section is associated with both short- and long-term risks that can extend years beyond the current delivery and affect the health of the woman, the child and future pregnancies. The latest data shows several countries such as South Africa, Ghana and Kenya are already past the recommended 15 percent while Senegal and Tanzania need to find ways to lower the births by CS to those required for medically indicated reasons.`,
    chartImage: images.charts.csSsa.url,
    docxFile: 'The prevalence of Caesarean section in SSA countries.docx'
  },
  {
    id: 'fgm-ssa-2025',
    title: 'Why does female genital cutting continue to be a justified practice in SSA',
    date: 'Aug 19, 2025',
    author: 'Rachael Nagaddya',
    category: 'Women\'s Health',
    excerpt: 'Female Genital Mutilation/Cutting (FGM/C) or Female Circumcision (FC) is a harmful cultural and traditional practice that involves total or partial removal of the external parts of the female genitalia or any other injury to the genital organ.',
    fullContent: `Female Genital Mutilation/Cutting (FGM/C) or Female Circumcision (FC) is a harmful cultural and traditional practice that involves total or partial removal of the external parts of the female genitalia or any other injury to the genital organ. Unlike male circumcision, FGM produces no known health benefits, neither is it performed for medical reasons; rather, it is an initiation rite of passage to womanhood that aims to ensure premarital virginity and marital fidelity by reducing a woman's desire for extramarital sexual acts. Not only does the procedure violate human rights, the annual cost of obstetric complications thereof is estimated at more than 3.7 million dollars. The WHO identified four main types of FGM/C in which victims may die due to haemorrhage or septic shock, or experience considerable physical, psychological and sexual complications. 

The prevalence of FGM spreads across the middle, east and west of Africa, as well as Asia where, UNICEF estimated that 200 million girls and women alive today have been cut, 92 million girls 10years and older of whom are specifically from Africa. The most recent data shows that the practice is most and least done in Sierra Leone and Uganda with 84 percent and 1.4 percent of women mutilated respectively.`,
    chartImage: images.charts.fgm.url,
    docxFile: 'FGM.docx'
  },
  {
    id: 'health-facility-delivery-ssa-2025',
    title: 'What could discourage expectant mothers from giving birth in a health facility in SSA',
    date: 'Aug 20, 2025',
    author: 'Rachael Nagaddya',
    category: 'Maternal Health',
    excerpt: 'The period of pregnancy from inception to postnatal care is life saving for both the woman and child. It requires skilled care to ensure prevention, detection and management of complications such as postpartum haemorrhage, infections, preeclampsia and eclampsia among others.',
    fullContent: `The period of pregnancy from inception to postnatal care is life saving for both the woman and child. It requires skilled care to ensure prevention, detection and management of complications such as postpartum haemorrhage, infections, preeclampsia and eclampsia among others, all of which can only be provided in a health facility set up. Therefore, the role of a health facility where skilled care during childbirth is provided in order to prevent or reduce maternal and neonatal mortality is indisputable. 

Regardless of this, utilization of health facility-based deliveries in SSA is hindered by reasons such as; disrespectful and abusive behaviour, abandonment of women, non-consented care, non-confidential care, non-dignified care. Yet, many governments have committed themselves to increasing the proportion of women who give birth in health facilities with some are aiming for 100 percent. This mistreatment and abuse of expectant mothers in labour widely reported in studies especially conducted in public health facilities may deter future use by affected women and those within their social circles.`,
    chartImage: images.charts.facilityBirths.url,
    docxFile: 'What could discourage expectant mothers from giving birth in a health facility in SSA.docx'
  },
  {
    id: 'sexual-intercourse-age-ssa-2025',
    title: 'The relevance of median age of first sexual intercourse among women aged 25-49 years in SSA',
    date: 'Aug 20, 2025',
    author: 'Rachael Nagaddya',
    category: 'Reproductive Health',
    excerpt: 'First sexual intercourse contributes to redefining one\'s identity from child/adolescent to adulthood; placing young people into a group exposed to risks of unintended pregnancy, sexually transmitted diseases and other reproductive health outcomes.',
    fullContent: `First sexual intercourse contributes to redefining one's identity from child/adolescent to adulthood; placing young people into a group exposed to risks of unintended pregnancy, sexually transmitted diseases and other reproductive health outcomes. Early age of first sexual inter course has to some extent been associated with multiple sexual partners, infrequent use of condoms, unsafe abortion and HIV. Recently, more young people are showing faster physical maturity; this compounded with most parents in SSA not exposing their children to sex education leaves most young people in the whim of their peers who are into sexual promiscuity resulting in early sexual exposure. 

The United Nations Department of Economic and Social Affairs reports that people especially the illiterate, old and some from undeveloped countries tend to round their ages to a multiple of 5 or 10 which makes the median more resistant to such errors than the mean. The goal in many countries is to delay this median age of first sexual intercourse by enacting policies that keep children in school because evidence shows that girls who have attained low education are more likely to engage in sexual intercourse at an earlier age than their counterparts who have attained secondary or higher education.`,
    chartImage: images.charts.medianAgeSexualIntercourse.url,
    docxFile: 'The relevance of median age of first sexual intercourse among women aged 25.docx'
  },
  {
    id: 'mosquito-net-pregnancy-ssa-2025',
    title: 'Sleeping under an insecticide treated mosquito net as a pregnant woman in SSA should not be debatable',
    date: 'Aug 21, 2025',
    author: 'Rachael Nagaddya',
    category: 'Maternal Health',
    excerpt: 'Malaria remains endemic across entire populations in most SSA countries but disproportionately affects pregnant women, making it a significant public health problem. Malaria in pregnancy is one of the causes of negative birth outcomes such as low birth weight, fetal loss, retarded growth, maternal anaemia and premature births.',
    fullContent: `Malaria remains endemic across entire populations in most SSA countries but disproportionately affects pregnant women, making it a significant public health problem. Malaria in pregnancy is one of the causes of negative birth outcomes such as low birth weight, fetal loss, retarded growth, maternal anaemia and premature births. To control the adverse effects of malaria, the WHO recommends intermittent preventive treatment in pregnancy with sulfadoxine-pyrimethamine, use of insecticide-treated bed nets (ITNs), and effective case management of clinical malaria and anaemia. 

However, sleeping under an ITN remains the primary vector control tool in most malaria endemic countries yet, latest data shows the percentage of pregnant women in several SSA who sleep under these nets remains critically below 80 percent. This leaves the odds of contracting malaria higher among pregnant women who do not sleep under an ITN and the benefits to the health of pregnant women and their unborn children not tapped into.`,
    chartImage: images.charts.itn.url,
    docxFile: 'Sleeping under an insecticide treated mosquito net as a pregnant woman in SSA.docx'
  },
  {
    id: 'open-defecation-ssa-2025',
    title: 'The health consequences of open defecation to many households in SSA',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Public Health',
    excerpt: 'Open defecation (OD) is both the disposal of human faeces and the practice of defecating in open fields, waterways, bushes, forests, open bodies of water, and other open spaces. The 2021 WHO and UNICEF joint monitoring program reports that globally, 494 million people practice open defecation; nearly half of whom live in sub-Saharan Africa.',
    fullContent: `Open defecation (OD) is both the disposal of human faeces and the practice of defecating in open fields, waterways, bushes, forests, open bodies of water, and other open spaces. The 2021 WHO and UNICEF joint monitoring program reports that globally, 494 million people practice open defecation; nearly half of whom live in sub-Saharan Africa. This degrading vice not only results in several gastrointestinal diseases but also exposes girls and women to increased sexual exploitation and a lack of privacy when they are menstruating. The determining factors for OD include; remoteness, demographic and geographic factors, absence of sanitation facilities, financial constraints, rocky or unstable soil conditions, large household size and social norms or behavioural pattern. Monitoring the percentage of households practicing OD is relevant in achieving SDG 6.2 Sanitation and Hygiene that focuses on achieving access to adequate and equitable sanitation and hygiene for all and end open defecation, paying special attention to the needs of women and girls and those in vulnerable situations.

Data from some SSA countries shows that in Uganda, the better performing country, household members that are five years and older in 4 out of every 100 households dispose their faecal matter in the open. This implies that toilet facilities are still a crucial development amenity in order to recognizes access to clean water, sanitation, and health (WASH) as a human right.`,
    chartImage: images.charts.openDefecation.url,
    docxFile: 'The health consequences of open defecation to many households in sub.docx'
  },
  {
    id: 'neonatal-mortality-ssa-2025',
    title: 'Significance of Neonatal Mortality Rate (NMR) to the health systems of SSA',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'Neonatal Mortality Rate (NMR), is expressed as the number of deaths within the first 28 days of an infant\'s life, per 1000 live births. WHO reports that Sub-Saharan Africa has the highest burden of neonatal mortality with an estimated 27 deaths per 1000 live births.',
    fullContent: `Neonatal Mortality Rate (NMR), is expressed as the number of deaths within the first 28 days of an infant's life, per 1000 live births. WHO reports that Sub-Saharan Africa has the highest burden of neonatal mortality with an estimated 27 deaths per 1000 live births mainly caused by; prematurity and low-birth-weight, infections, lack of oxygen at birth, and birth trauma, poor socioeconomic households, and lack of maternal education among others. It is an indicator for SDG 3.2.2 (End preventable deaths of newborns and infants under the age of 5 years), the health environment into which children are born and the effectiveness of prenatal and postnatal care. As such, this rate reflects a country's maternal health, quality and accessibility of medical care, and public health practices. 

Low NMR often is indicative of effective healthcare systems and vice versa thereby helping in assessing the impact of health policies and interventions over time to guide necessary adjustments. With the 2030 SDG NMR target at 12 or fewer deaths per 1000 live births, even the better ranking countries of Malawi, Uganda and Zambia are at risk of missing this target if there is no additional investment in health care.`,
    chartImage: images.charts.neonatalMortality.url,
    docxFile: 'Significance of Neonatal Mortality Rate.docx'
  },
  {
    id: 'severe-wasting-infants-ssa-2025',
    title: 'In SSA severe wasting of infants 0-5 months is most prevalent in the humanitarian crisis countries of Somalia and DRC',
    date: 'Aug 21, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'Severe wasting also known as severe acute malnutrition is the most lethal form undernutrition and one of the top threats to child survival. Defined as low-weight-for-height that is less than -3 standard deviation and a mid-upper arm circumference (MUAC) less than 115 mm.',
    fullContent: `Severe wasting also known as severe acute malnutrition is the most lethal form undernutrition and one of the top threats to child survival. Defined as low-weight-for-height that is less than -3 standard deviation and a mid-upper arm circumference (MUAC) less than 115 mm, it is caused by a lack of nutritious food and repeated bouts of diseases such as diarrhoea, measles and malaria, which in turn compromise a child's immunity. 

In infants less than 6 months, severe wasting is defined by low weight-for-length or the presence of bilateral pitting oedema. It is often associated with higher mortality in these young infants than in older infants and children. In addition to low birth weight, severe wasting of these children is an indication of suboptimal feeding practices, especially breastfeeding practices. Data shows that severe wasting is not only prevalent in Somalia and Democratic republic of Congo, countries facing humanitarian crises but also in relatively stable countries such as Uganda.`,
    chartImage: images.charts.severeWastingInfants.url,
    docxFile: 'Severe wasting in infants 0-5 months.docx'
  },
  {
    id: 'severe-wasting-children-ssa-2025',
    title: 'Severe wasting among children 24-59 months in SSA disaggregated by sex in Low Income African countries',
    date: 'Aug 21, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'According to UNICEF, 1 in 1 in 5 deaths among children under the age of 5 globally, is attributed to severe wasting robbing the lives of millions of boys and girls. The biological attributes of male and female are important considerations in the public health domain.',
    fullContent: `According to UNICEF, 1 in 1 in 5 deaths among children under the age of 5 globally, is attributed to severe wasting robbing the lives of millions of boys and girls. The biological attributes of male and female are important considerations in the public health domain and it is no wonder that different studies and disciplines hold contrary views on the relative vulnerability of male and female children. For example, in neonatal medicine, boys are known to be more vulnerable than girls, from as early as the point of conception. 

However, most recent data indicates that across several SSA countries, the percentage of severely wasted boys is higher than girls in the same age bracket and the reasons to these boy–girl differences have not been extensively explored in the nutrition field. None the less, nutrition and diets for children less than 5 years should be diverse and in cases of severe wasting, Ready-to-Use Therapeutic Food (RUTF) can save children.`,
    chartImage: images.charts.severeWastingChildren.url,
    docxFile: 'Severe wasting among children less than 5 years.docx'
  },
  {
    id: 'severe-wasting-maternal-education-ssa-2025',
    title: 'Severe wasting among children below 24 months disaggregated by maternal level of education in Low Income African Countries',
    date: 'Aug 21, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'WHO indicates that undernutrition not only causes half of the deaths of children under five years but, it also may lead to wasting, which is detrimental to cognitive ability consequently prejudicing school and work performance.',
    fullContent: `WHO indicates that undernutrition not only causes half of the deaths of children under five years but, it also may lead to wasting, which is detrimental to cognitive ability consequently prejudicing school and work performance. Studies show that parental factors such as level of maternal education could contribute to the health of children under the age of five years. Maternal education levels can affect child health through the mechanisms or pathways channels. Through the mechanisms channel, education contributes to increase income by enabling mothers to be in the labour force which could provide better choices in terms of the affordability of care and increased prospects of better care. While in the pathways channel, a child's health can be impacted directly through maternal health literacy.

Knowledge and gains from both channels can translate into the correct nutritional choices being made in the early years of children's lives, which nutritional choices have been found to affect not only physical but also mental development. However, maternal education has a down side of keeping her absent from her children due to school and/or work demands. But overall, maternal education has far better reaching benefits to a child's health. This is evident from the JME data visualised below where in most SSA countries, there is a higher percentage of severely wasted children below 5 years born to mothers that have attained no education or primary school education at best.`,
    chartImage: images.charts.severeWastingMaternalEducation.url,
    docxFile: 'Severe wasting among children below 24 months disaggregated by the mother.docx'
  },
  {
    id: 'severe-anaemia-children-ssa-2025',
    title: 'Prevalence of severe anaemia among children less than 5 years in SSA countries',
    date: 'Aug 19, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'Anaemia is the below-normal red blood cell count or haemoglobin level per unit volume in peripheral blood and in severe anemic cases this measurement is below 7g/dl. The top three contributing causes globally are dietary iron deficiency, Vitamin A deficiency, and Beta-thalassemia trait.',
    fullContent: `Anaemia is the below-normal red blood cell count or haemoglobin level per unit volume in peripheral blood and in severe anemic cases this measurement is below 7g/dl. The top three contributing causes globally are dietary iron deficiency, Vitamin A deficiency, and Beta-thalassemia trait. Anemia in children below 5 years is a public health problem worldwide because it under mines the attainment of SDG 2.2. 

Children under 5 years have a greater need for nutrition and higher consequence as a result of the lack thereof due to lesser reserves which makes anaemia in under-five children is a special case. At an individual level, childhood anaemia contributes to poor motor and cognitive development, poor school performance, as well as increased morbidity and mortality while socioeconomically, it negatively impacts the well-being and productivity of a country. From the recent data, 5 percent of children under 5 years in Nigeria are severely anaemic in comparison to Uganda's approximate 2 percent. Ultimately, programs that ensure distribution of iron supplements, nutrition interventions and malaria chemoprevention are mandatory across SSA.`,
    chartImage: images.charts.severeAnaemia.url,
    docxFile: 'Prevalence of severe anaemia among children less than 5 years in SSA countries.docx'
  },
  {
    id: 'maternal-death-ssa-2025',
    title: 'Prevalence of death during pregnancy, delivery and the two months after child birth in SSA',
    date: 'Aug 20, 2025',
    author: 'Rachael Nagaddya',
    category: 'Maternal Health',
    excerpt: 'The larger percentage of pregnancy related deaths are preventable since health-care solutions to prevent or manage complications are well known. The complications that account for around 75 percent of such deaths are: severe bleeding after childbirth, infections, pre-eclampsia and eclampsia and complications from delivery among others.',
    fullContent: `The larger percentage of pregnancy related deaths are preventable since health-care solutions to prevent or manage complications are well known. The complications that account for around 75 percent of such deaths are: severe bleeding after childbirth, infections, pre-eclampsia and eclampsia and complications from delivery among others. In 2023, WHO estimated global maternal deaths at 260,000 women during and following pregnancy and childbirth, 87 percent of whom were from Saharan Africa and southern Asia. 

These deaths are a huge tragedy to the social and economic impact of immediate family and community which is why SDG 3.1 targets this ratio to less than 70 per 100 000 live births and maximum of 140 per 100 000 livebirths in countries known for high occurrence. However, from the latest data, even Tanzania, the better ranking country recorded 6.1 percent of women in their reproductive age die due to pregnancy related complications, it is going to be a herculean task that will require implementation of effective policies especially equitable access to high quality care in pregnancy, and during and after childbirth.`,
    chartImage: images.charts.pregnancyDeath.url,
    docxFile: 'Prevalence of death during pregnancy.docx'
  },
  {
    id: 'intimate-partner-violence-uganda-2025',
    title: 'Physical or sexual violence against women by an intimate partner/husband in the rural and urban residences of Uganda',
    date: 'Aug 21, 2025',
    author: 'Rachael Nagaddya',
    category: 'Women\'s Health',
    excerpt: 'Any behaviour by an intimate partner or ex-partner that causes physical, sexual or psychological harm, including physical aggression, sexual coercion, psychological abuse and controlling behaviours is violence. Intimate partner abuse is mostly done against women with risk factors including: marital discord and dissatisfaction, male controlling behaviours towards their partners, difficulties in communicating between partners and past history of exposure to violence.',
    fullContent: `Any behaviour by an intimate partner or ex-partner that causes physical, sexual or psychological harm, including physical aggression, sexual coercion, psychological abuse and controlling behaviours is violence. Intimate partner abuse is mostly done against women with risk factors including: marital discord and dissatisfaction, male controlling behaviours towards their partners, difficulties in communicating between partners and past history of exposure to violence. The effects thereof include physical, mental, sexual, and reproductive health problems, may increase the risk of acquiring HIV in some settings and traumatic experiences for the victim's children.

The WHO estimated in 2024 that 1 in every 3 women word wide has been subjected to sexual or physical abuse from an intimate partner. The latest data in Uganda shows the higher prevalence of this violence against women in rural residences is linked to some either justifying or tolerating it, and lower education levels and wealth index compared with urban women.`,
    chartImage: images.charts.violenceAgainstWomen.url,
    docxFile: 'physical and sexual violence by an intimate partner.docx'
  },
  {
    id: 'mtct-uganda-2025',
    title: 'Protecting the next generation from HIV through information dissemination of mother to child transmission in the rural and urban residences of Uganda',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Public Health',
    excerpt: 'Of the 1.4 million people living with HIV in Uganda, 860,000 are women and 80,000 are children. Therefore, as part of the strategy to prevent new HIV infections among newborns, Uganda has a robust prevention of mother-to-child transmission (PMTCT) program which involves; following up women of reproductive age living with, or at risk of acquiring HIV throughout pregnancy to the end of the breastfeeding period.',
    fullContent: `Of the 1.4 million people living with HIV in Uganda, 860,000 are women and 80,000 are children. Therefore, as part of the strategy to prevent new HIV infections among newborns, Uganda has a robust prevention of mother-to-child transmission (PMTCT) program which involves; following up women of reproductive age living with, or at risk of acquiring HIV throughout pregnancy to the end of the breastfeeding period. In 2022, a study by Makerere University-Johns Hopkins University showed that 90 percent of new HIV infections among infants and young children occur through MTCT which justifies why PMTCT remains a priority in the country.

Through a well-coordinated multisectoral response, the program primarily ensures information dissemination to guarantee that women are aware MTCT can be prevented during pregnancy, during delivery and through breastfeeding. The latest data shows that the percentage of women with knowledge of all three has increased to above 60 percent over the years with little to no difference between women in the urban and rural residences. Although remarkable progress has been made, studies further show bottlenecks that hinder wider access to and utilization of PMTCT such as less coverage in pregnant adolescents (10–19 years) due to disapproving health care providers.`,
    chartImage: images.charts.mtct.url,
    docxFile: 'MTCT.docx'
  },
  {
    id: 'fertility-rate-education-uganda-2025',
    title: 'More/longer education is linked to a reduction in the fertility rate of women (15-49 years) in Uganda',
    date: 'Aug 18, 2025',
    author: 'Rachael Nagaddya',
    category: 'Reproductive Health',
    excerpt: 'World Health Organization defines Fertility Rate (FR) as the average number of live births a woman can have by the end of her reproductive period (15 to 49 years) if she is not subject to mortality. The World Bank estimates that the fertility rate in SSA declined from 6.5 children in 1985–1990 to 4.7 children per woman in 2017.',
    fullContent: `World Health Organization defines Fertility Rate (FR) as the average number of live births a woman can have by the end of her reproductive period (15 to 49 years) if she is not subject to mortality. The World Bank estimates that the fertility rate in SSA declined from 6.5 children in 1985–1990 to 4.7 children per woman in 2017. FR is a major determinant of population growth rate and the age structure  of populations with a continuously reducing FR resulting in rapid aging of populations and the consequential lack of human labour. The economic theory explains FR as a trade-off between the number (quantity) of children a woman chooses to have and the quality of those children, how much time and resources the mother invests in each child. 

Data collected from 1988 to 2019 in Uganda shows a reduction in the FR and an inverse relationship between level of education attained and the FR of women. In part, this is because a higher level of education is a predisposing factor to the rise in contraceptive use. But also, more and longer education can bring about empowerment of women, later marriage, later onset of childbearing, and smaller family size.`,
    chartImage: images.charts.fertilityRate.url,
    docxFile: 'More longer education is linked to a reduction in the fertility rate.docx'
  },
  {
    id: 'caesarean-section-uganda-2025',
    title: 'Increasing caesarean section rates in Uganda',
    date: 'Aug 20, 2025',
    author: 'Rachael Nagaddya',
    category: 'Maternal Health',
    excerpt: 'In an effort to reduce maternal mortality, the government of Uganda has made deliberate effort to increase availability, quality, access to, and utilization of emergency obstetric care services and caesarean sections (CS) to manage and treat complications of pregnancy, labour, and delivery.',
    fullContent: `In an effort to reduce maternal mortality, the government of Uganda has made deliberate effort to increase availability, quality, access to, and utilization of emergency obstetric care services and caesarean sections (CS) to manage and treat complications of pregnancy, labour, and delivery. However, in recent years, CS rates categorized as emergency or elective have increased worldwide (Uganda is no exception) without added benefits, raising concerns of over utilization. 

Worryingly, research affirms this trend of increase in CS in Uganda, some of which are purely maternal requests especially in urban areas, amongst the affluent populations of more educated women. These inequities are inter-related as it is more likely for women to belong to the higher wealth quintiles, and reside in urban areas, making them more likely to make independent personal choices regarding their preferred mode of delivery.`,
    chartImage: images.charts.csUganda.url,
    docxFile: 'Increasing caesarean section rates in Uganda.docx'
  },
  {
    id: 'electricity-access-uganda-2025',
    title: 'The trend of household access to electricity in the urban and rural residences of Uganda',
    date: 'Aug 19, 2025',
    author: 'Rachael Nagaddya',
    category: 'Energy & Environment',
    excerpt: 'In this digital and industrial era, access to electricity is a prerequisite for transformation of economies in Africa. By 2016, 42.8 percent of the continent\'s population had access to electricity with more than 600 million people living without electricity including more than 80 percent of those residing in rural areas.',
    fullContent: `In this digital and industrial era, access to electricity is a prerequisite for transformation of economies in Africa. By 2016, 42.8 percent of the continent's population had access to electricity with more than 600 million people living without electricity including more than 80 percent of those residing in rural areas. Electricity access is growing in SSA albeit at a slow pace; for instance, between 1991 and 2016 access to electricity rose by 20 percent but, at this rate, the region will not achieve the SDG target for universal access to electricity by 2030. Moreover, the insufferable frequency of power blackouts, high initial connection, tariffs, and monthly standard service fee for electricity have been cited in studies as some of the hindrances to grid electricity in many African countries.

Despite Uganda's National Development Plans III & IV and the  National Energy Policy 2023 significant access to electricity disparities still persist especially in the rural residences of the country. This means that most households in rural residences still rely on inefficient energy sources such as kerosene, solar lamps that lead to severe health and environmental repercussions and economic losses.`,
    chartImage: images.charts.electricity.url,
    docxFile: 'Household access to electricity in the urban and rural residences of Uganda.docx'
  },
  {
    id: 'exclusive-breastfeeding-ssa-2025',
    title: 'Exclusive breastfeeding for the first 6 months has far reaching benefits for infants in SSA',
    date: 'Aug 20, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'WHO recommends exclusive breastfeeding (EBF) for the first six months; meaning the infant only receives breast milk. No other liquids, or solids are given except oral rehydration solution, or drops/syrups of vitamins, minerals or medicines.',
    fullContent: `WHO recommends exclusive breastfeeding (EBF) for the first six months; meaning the infant only receives breast milk. No other liquids, or solids are given except oral rehydration solution, or drops/syrups of vitamins, minerals or medicines. The advantages of breastmilk are far reaching; from providing essential, irreplaceable nutrition which is a cornerstone of child survival and health, providing protection from respiratory infections, diarrhoea, to protecting against obesity and certain noncommunicable diseases later in life. 

Globally, as of 2023, 48 percent of infants aged 0 to 6 months are exclusively breastfed which is an indication that breastfeeding is often practiced as supplementary feeding rather than exclusively. This is against the global breast-feeding collective target of 70 percent by 2030. With the median EBF duration in Mali as little as less than 2 months to 5 months in Rwanda, all of which is below what is recommended means that millions of children across SSA are not optimally getting the required nutrients and health benefits from breastmilk.`,
    chartImage: images.charts.exclusiveBreastfeeding.url,
    docxFile: 'Exclusively breastfeeding.docx'
  },
  {
    id: 'contraceptive-methods-uganda-2025',
    title: 'Contraceptive methods used by women in Uganda to meet their reproductive desires',
    date: 'Aug 19, 2025',
    author: 'Rachael Nagaddya',
    category: 'Reproductive Health',
    excerpt: 'Choice is the principle in both quality of care and the broader rights-based approach to family planning where user-centred information, counselling, and services enable people to decide and freely choose a contraceptive method that best meets their reproductive desires.',
    fullContent: `Choice is the principle in both quality of care and the broader rights-based approach to family planning where user-centred information, counselling, and services enable people to decide and freely choose a contraceptive method that best meets their reproductive desires. Consequently, this allows couples if and when to have children by way of voluntarily and intentionally delaying, spacing or limiting pregnancies; making contraception a vital focus of the global agenda for maternal health. It can further be beneficial to men and women by improving the health, economic, and social domains of their lives. In 2019, globally, an estimated 44 percent and 4 percent of women in their reproductive age (15-49 years) used modern and traditional contraceptive methods respectively. 

The United Nations Department of Economic and Social Affairs, reported that worldwide, female sterilisation, male condoms, IUDs and the pill are the most commonly used contraceptives. As for Uganda, recent data shows that injections, implants and condoms are the most preferred contraceptive methods for women. It is therefore important to understand the mix of methods used in Uganda in order to offer insight into enabling self-sufficiency in choice, such that women access and use the method that best suits their needs.`,
    chartImage: images.charts.contraceptiveMethods.url,
    docxFile: 'Contraceptive methods used by women in Uganda.docx'
  },
  {
    id: 'vaccination-east-africa-2025',
    title: 'The importance of administering all 8 basic antigens to children in East Africa',
    date: 'Aug 22, 2025',
    author: 'Rachael Nagaddya',
    category: 'Child Health',
    excerpt: 'Vaccines have for over two centuries safely reduced the blight of diseases like polio, measles and smallpox; placing them among the greatest advances in global health and development. As one of the most cost effective first line of defence against a host of diseases, vaccination helps children to not only survive but also thrive.',
    fullContent: `Vaccines have for over two centuries safely reduced the blight of diseases like polio, measles and smallpox; placing them among the greatest advances in global health and development. As one of the most cost effective first line of defence against a host of diseases, vaccination helps children to not only survive but also thrive. In the long run, not only is the health and wealth of individuals improved, but there can also be a reduction in spending on health care as well as supporting societies and economies in developing human capital and productivity. 

However, violent conflicts, displacement, covid-19 related disruptions, and vaccination misinformation have cut children off from routine immunization. In their "State of the world's children report 2023", UNICEF estimates that 67 million children missed essential vaccines in the last three years due to the aforementioned reasons; 60 percent of whom live in 10 countries including Democratic Republic of Congo. Hence, it is a no brainer that latest data shows DRC has the lowest percentage of children that have received all 8 antigens, exposing a large number of children to otherwise preventable diseases.`,
    chartImage: images.charts.basicAntigens.url,
    docxFile: '8 basic antigens to children in East Africa.docx'
  }
];
