import { v4 as uuidv4 } from 'uuid'
import { subDays, subHours, format } from 'date-fns'

const ago = (days, hours = 8) => subHours(subDays(new Date(), days), hours).toISOString()

const moodScores = [1, -1, 2, 3, -2, 1, 4, 2, 0, -1, 3, 2, 1, -3, 2, 3, 1, 4, -1, 2]
const emotions = [
  ['Blij', 'Energiek', 'Gemotiveerd'],
  ['Moe', 'Onzeker', 'Verdrietig'],
  ['Kalm', 'Dankbaar', 'Ontspannen'],
  ['Boos', 'Gefrustreerd', 'Angstig'],
  ['Blij', 'Trots', 'Verbonden'],
  ['Verdrietig', 'Eenzaam', 'Moe'],
  ['Energiek', 'Hoopvol', 'Gemotiveerd'],
  ['Kalm', 'Dankbaar', 'Liefdevol'],
  ['Angstig', 'Onzeker', 'Overweldigd'],
  ['Blij', 'Nieuwsgierig', 'Geïnspireerd'],
]

export function generateSampleData() {
  const journal = [
    { id: uuidv4(), title: 'Een nieuwe start', content: 'Vandaag voelde ik me verrassend goed. De ochtend begon rustig en ik had tijd voor mezelf. Het is fijn om even stil te staan bij wat er echt toe doet.\n\nIk merkte dat ik meer energie had wanneer ik begon met een kleine wandeling. Dat wil ik vaker doen.', tags: ['reflectie', 'energie'], createdAt: ago(0, 7), updatedAt: ago(0, 7) },
    { id: uuidv4(), title: 'Moeilijke vergadering', content: 'De vergadering van vandaag was uitputtend. Ik merkte dat ik moeilijk mijn grens kon aangeven. De Bestraffende Ouder was aanwezig — ik gaf mezelf de schuld van de spanning.\n\nLater besefte ik dat ik gewoon moe was. Meer slaap nodig.', tags: ['werk', 'grenzen', 'schema'], createdAt: ago(1, 9), updatedAt: ago(1, 9) },
    { id: uuidv4(), title: 'Goed gesprek', content: 'Had een diep gesprek met mijn vriend/vriendin. Voelde me echt gehoord. Het is bijzonder hoe een goed gesprek je energie kan geven.', tags: ['relaties', 'verbinding'], createdAt: ago(2, 18), updatedAt: ago(2, 18) },
    { id: uuidv4(), title: 'Natuur en rust', content: 'Lange wandeling in het bos gemaakt. Geen muziek, geen podcasts — alleen de natuur. Ik had het nodiger dan ik dacht. Mijn gedachten werden stiller.', tags: ['natuur', 'rust', 'beweging'], createdAt: ago(3, 10), updatedAt: ago(3, 10) },
    { id: uuidv4(), title: 'Terugval in oud patroon', content: 'Vandaag merkte ik dat ik mezelf volledig wegcijferde in een gesprek. De Onderdanige Volgzaamheid mode was sterk. Ik zei "ja" terwijl ik "nee" voelde.\n\nDit is een patroon dat ik wil doorbreken. Wat had de Gezonde Volwassene gedaan? Vriendelijk maar duidelijk "nee" zeggen.', tags: ['schema', 'grenzen', 'bewustzijn'], createdAt: ago(4, 11), updatedAt: ago(4, 11) },
    { id: uuidv4(), title: 'Creatieve ochtend', content: 'Vanochtend heel vroeg wakker geworden en in plaats van op mijn telefoon te kijken, heb ik getekend. Twee uur lang. Ik vergat de tijd. Dit is wat flow voelt.', tags: ['creativiteit', 'flow', 'ochtend'], createdAt: ago(5, 6), updatedAt: ago(5, 6) },
    { id: uuidv4(), title: 'Reflectie op week', content: 'De afgelopen week was zwaar maar leerzaam. Ik heb drie keer gesport, wat verschil maakte. Slaap was wisselend. Wil volgende week meer structuur aanbrengen.', tags: ['reflectie', 'week', 'doelen'], createdAt: ago(7, 20), updatedAt: ago(7, 20) },
    { id: uuidv4(), title: 'Angst voor de toekomst', content: 'Vanavond veel piekeren over de toekomst. Wat als het niet lukt? Ik merkte de Angstige Modus en probeerde via Gezonde Volwassene te reageren: "Je hebt altijd een uitweg gevonden. Dit is niet anders."', tags: ['angst', 'toekomst', 'schema'], createdAt: ago(8, 21), updatedAt: ago(8, 21) },
    { id: uuidv4(), title: 'Klein succes', content: 'Iets wat ik al weken uitstelde eindelijk gedaan. Het gevoel van opluchting is enorm. Ik ben trots op mezelf.', tags: ['succes', 'trots', 'actie'], createdAt: ago(10, 14), updatedAt: ago(10, 14) },
    { id: uuidv4(), title: 'Contact met familie', content: 'Lang gesprek gehad met mijn ouders. Gemengde gevoelens. Er is liefde maar ook spanning. Ik merk hoe oud patronen opkomen bij familiecontact.', tags: ['familie', 'patronen', 'relaties'], createdAt: ago(12, 16), updatedAt: ago(12, 16) },
  ]

  const moods = Array.from({ length: 18 }, (_, i) => ({
    id: uuidv4(),
    score: moodScores[i % moodScores.length],
    emotionTags: emotions[i % emotions.length],
    note: i % 3 === 0 ? 'Gewoon een normale dag, maar opmerkzaam geweest.' : '',
    createdAt: ago(i, 8 + (i % 6)),
    updatedAt: ago(i, 8 + (i % 6)),
  }))

  const healthSleep = Array.from({ length: 14 }, (_, i) => ({
    id: uuidv4(),
    hours: [7.5, 6, 8, 5.5, 7, 8.5, 6.5, 7, 5, 8, 7.5, 6, 7, 8][i],
    quality: [7, 5, 8, 4, 7, 9, 6, 7, 4, 8, 8, 6, 7, 9][i],
    bedtime: '23:00',
    wakeTime: '07:00',
    notes: '',
    createdAt: ago(i, 7),
    updatedAt: ago(i, 7),
  }))

  const healthSport = [
    { id: uuidv4(), activity: 'Hardlopen', durationMinutes: 35, intensity: 'medium', notes: 'Goed gevoel', createdAt: ago(0, 17), updatedAt: ago(0, 17) },
    { id: uuidv4(), activity: 'Yoga', durationMinutes: 45, intensity: 'low', notes: 'Ontspannend', createdAt: ago(1, 7), updatedAt: ago(1, 7) },
    { id: uuidv4(), activity: 'Fietsen', durationMinutes: 60, intensity: 'medium', notes: 'Door het park', createdAt: ago(3, 16), updatedAt: ago(3, 16) },
    { id: uuidv4(), activity: 'Zwemmen', durationMinutes: 50, intensity: 'high', notes: 'Intensief maar goed', createdAt: ago(5, 18), updatedAt: ago(5, 18) },
    { id: uuidv4(), activity: 'Wandelen', durationMinutes: 90, intensity: 'low', notes: 'Bos wandeling', createdAt: ago(7, 11), updatedAt: ago(7, 11) },
    { id: uuidv4(), activity: 'Krachttraining', durationMinutes: 55, intensity: 'high', notes: 'Full body', createdAt: ago(9, 17), updatedAt: ago(9, 17) },
    { id: uuidv4(), activity: 'Hardlopen', durationMinutes: 40, intensity: 'medium', notes: '', createdAt: ago(11, 7), updatedAt: ago(11, 7) },
    { id: uuidv4(), activity: 'Yoga', durationMinutes: 30, intensity: 'low', notes: 'Ochtend routine', createdAt: ago(13, 7), updatedAt: ago(13, 7) },
  ]

  const healthNutrition = [
    { id: uuidv4(), mealType: 'breakfast', description: 'Havermout met fruit en noten', moodAfter: 2, notes: 'Veel energie', createdAt: ago(0, 6), updatedAt: ago(0, 6) },
    { id: uuidv4(), mealType: 'lunch', description: 'Salade met kip en avocado', moodAfter: 1, notes: '', createdAt: ago(0, 11), updatedAt: ago(0, 11) },
    { id: uuidv4(), mealType: 'dinner', description: 'Pasta met groenten, veel koolhydraten', moodAfter: -1, notes: 'Voelde zwaar', createdAt: ago(0, 18), updatedAt: ago(0, 18) },
    { id: uuidv4(), mealType: 'breakfast', description: 'Ei en toast', moodAfter: 2, notes: '', createdAt: ago(1, 7), updatedAt: ago(1, 7) },
    { id: uuidv4(), mealType: 'snack', description: 'Chocolade en koffie', moodAfter: -2, notes: 'Suikerdip', createdAt: ago(2, 15), updatedAt: ago(2, 15) },
  ]

  const healthTension = [
    { id: uuidv4(), level: 7, bodyParts: ['nek', 'schouders'], trigger: 'Stressvolle vergadering', notes: '', createdAt: ago(1, 14), updatedAt: ago(1, 14) },
    { id: uuidv4(), level: 4, bodyParts: ['kaak'], trigger: 'Onzekerheid over een beslissing', notes: 'Na meditatie beter', createdAt: ago(3, 16), updatedAt: ago(3, 16) },
    { id: uuidv4(), level: 8, bodyParts: ['borst', 'maag'], trigger: 'Conflict vermijden', notes: '', createdAt: ago(5, 11), updatedAt: ago(5, 11) },
    { id: uuidv4(), level: 3, bodyParts: ['rug'], trigger: 'Lang zitten', notes: 'Stretch gedaan', createdAt: ago(8, 14), updatedAt: ago(8, 14) },
  ]

  const schema = [
    { id: uuidv4(), mode: 'vulnerable_child', thought: 'Niemand begrijpt me echt', feeling: 'Verdrietig, eenzaam', behavior: 'Terugtrekken, stil worden', healthyAdultResponse: 'Ik mag me eenzaam voelen en toch contact zoeken. Ik ben het waard om begrepen te worden.', intensity: 7, createdAt: ago(1, 20), updatedAt: ago(1, 20) },
    { id: uuidv4(), mode: 'punitive_parent', thought: 'Ik had beter moeten weten, ik ben dom', feeling: 'Schaamte, schuld', behavior: 'Mezelf erg bekritiseren', healthyAdultResponse: 'Fouten maken is menselijk. Ik leer hiervan zonder mezelf te straffen.', intensity: 8, createdAt: ago(3, 15), updatedAt: ago(3, 15) },
    { id: uuidv4(), mode: 'detached_protector', thought: 'Het maakt me toch niet uit', feeling: 'Leeg, verdoofd', behavior: 'Afstand nemen, niet voelen', healthyAdultResponse: 'Dit is een beschermingsmechanisme. Het is veilig om te voelen. Ik doe het rustig aan.', intensity: 6, createdAt: ago(6, 21), updatedAt: ago(6, 21) },
    { id: uuidv4(), mode: 'happy_child', thought: 'Dit is precies wat ik nodig had!', feeling: 'Blij, vrij, speels', behavior: 'Lachen, genieten, aanwezig zijn', healthyAdultResponse: 'Koester dit gevoel. Maak ruimte voor meer van deze momenten.', intensity: 3, createdAt: ago(8, 16), updatedAt: ago(8, 16) },
    { id: uuidv4(), mode: 'overcompensator', thought: 'Ik moet dit perfect doen, anders faal ik', feeling: 'Gespannen, gedreven', behavior: 'Overwerken, geen pauze nemen', healthyAdultResponse: 'Goed genoeg is goed genoeg. Ik verander mijn waarde niet door perfectie.', intensity: 7, createdAt: ago(10, 14), updatedAt: ago(10, 14) },
  ]

  const triggers = [
    { id: uuidv4(), situation: 'Collega onderbrak me tijdens presentatie', automaticThought: 'Ze respecteren me niet, ik ben niet belangrijk', emotion: 'Boosheid', emotionIntensity: 7, alternativeThought: 'Ze waren waarschijnlijk enthousiast, niet opzettelijk respectloos', outcome: 'Voelde me rustiger, kon helder reageren', createdAt: ago(2, 15), updatedAt: ago(2, 15) },
    { id: uuidv4(), situation: 'Vriend reageerde niet op bericht', automaticThought: 'Hij/zij is boos op me of wil geen contact meer', emotion: 'Angst', emotionIntensity: 6, alternativeThought: 'Mensen zijn druk, het heeft waarschijnlijk niets met mij te maken', outcome: 'Kon loslaten na nadenken', createdAt: ago(4, 19), updatedAt: ago(4, 19) },
    { id: uuidv4(), situation: 'Maakte een fout in een rapport', automaticThought: 'Ik ben incompetent, iedereen zal dit merken', emotion: 'Schaamte', emotionIntensity: 8, alternativeThought: 'Iedereen maakt fouten. Ik heb het gecorrigeerd en geleerd.', outcome: 'Minder intense schaamte', createdAt: ago(7, 11), updatedAt: ago(7, 11) },
  ]

  const relationships = [
    { id: uuidv4(), personName: 'Alex', interactionType: 'support', emotionalImpact: 3, energyDelta: 3, notes: 'Geweldig gesprek over mijn doelen', createdAt: ago(0, 19), updatedAt: ago(0, 19) },
    { id: uuidv4(), personName: 'Collega Mark', interactionType: 'conflict', emotionalImpact: -3, energyDelta: -4, notes: 'Meningsverschil over aanpak project', createdAt: ago(2, 16), updatedAt: ago(2, 16) },
    { id: uuidv4(), personName: 'Mama', interactionType: 'conversation', emotionalImpact: 1, energyDelta: 0, notes: 'Fijn maar ook vermoeiend', createdAt: ago(3, 17), updatedAt: ago(3, 17) },
    { id: uuidv4(), personName: 'Vriend Sam', interactionType: 'social', emotionalImpact: 4, energyDelta: 3, notes: 'Grappige avond, veel gelachen', createdAt: ago(5, 20), updatedAt: ago(5, 20) },
    { id: uuidv4(), personName: 'Manager', interactionType: 'work', emotionalImpact: -1, energyDelta: -2, notes: 'Feedback gesprek, neutraal maar intens', createdAt: ago(8, 14), updatedAt: ago(8, 14) },
  ]

  const energy = [
    { id: uuidv4(), entryType: 'flow_moment', title: 'Schrijven zonder afleiding', description: 'Twee uur aan één stuk geschreven. Volledig in de zone.', durationMinutes: 120, energyLevel: 9, createdAt: ago(5, 9), updatedAt: ago(5, 9) },
    { id: uuidv4(), entryType: 'creative_activity', title: 'Tekenen', description: 'Karakterschetsen voor een project', durationMinutes: 90, energyLevel: 8, createdAt: ago(2, 19), updatedAt: ago(2, 19) },
    { id: uuidv4(), entryType: 'energy_source', title: 'Ochtendwandeling', description: 'Frisse lucht geeft me direct energie', durationMinutes: 30, energyLevel: 7, createdAt: ago(0, 7), updatedAt: ago(0, 7) },
    { id: uuidv4(), entryType: 'flow_moment', title: 'Muziek spelen', description: 'Gitaar spelen na lang niet gespeeld te hebben', durationMinutes: 45, energyLevel: 9, createdAt: ago(7, 21), updatedAt: ago(7, 21) },
    { id: uuidv4(), entryType: 'energy_source', title: 'Kookavond', description: 'Nieuw recept uitproberen', durationMinutes: 60, energyLevel: 6, createdAt: ago(9, 18), updatedAt: ago(9, 18) },
  ]

  const checkins = [
    { id: uuidv4(), checkType: 'morning', intention: 'Vandaag wil ik drie keer even bewust ademen wanneer ik stress voel', gratitude: ['Mijn gezondheid', 'De zon'], moodScore: 2, energyLevel: 6, createdAt: ago(0, 7), updatedAt: ago(0, 7) },
    { id: uuidv4(), checkType: 'evening', reflection: 'Het lukte goed. Ik heb twee keer bewust ademgehaald. Voelde me meer aanwezig.', gratitude: ['Een goed gesprek', 'Lekker eten'], moodScore: 3, energyLevel: 5, createdAt: ago(0, 21), updatedAt: ago(0, 21) },
    { id: uuidv4(), checkType: 'morning', intention: 'Vandaag één ding tegelijk doen en multitasking vermijden', gratitude: ['Rust', 'Vriendschap'], moodScore: 1, energyLevel: 5, createdAt: ago(1, 7), updatedAt: ago(1, 7) },
    { id: uuidv4(), checkType: 'evening', reflection: 'Redelijk gelukt. Werk stapelde wat op. Morgen opnieuw proberen.', gratitude: ['Mijn bed', 'De rust na de dag'], moodScore: 1, energyLevel: 4, createdAt: ago(1, 22), updatedAt: ago(1, 22) },
    { id: uuidv4(), checkType: 'morning', intention: 'Bewust genieten van mijn ochtend', gratitude: ['Koffie', 'Muziek'], moodScore: 3, energyLevel: 7, createdAt: ago(2, 7), updatedAt: ago(2, 7) },
    { id: uuidv4(), checkType: 'morning', intention: 'Iemand iets aardigs zeggen vandaag', gratitude: ['Familie', 'Mijn huis'], moodScore: 2, energyLevel: 6, createdAt: ago(3, 7), updatedAt: ago(3, 7) },
    { id: uuidv4(), checkType: 'evening', reflection: 'Compliment gegeven aan collega. Ze was blij verrast.', gratitude: ['Verbinding', 'Kleine momenten'], moodScore: 4, energyLevel: 7, createdAt: ago(3, 21), updatedAt: ago(3, 21) },
  ]

  return { journal, moods, schema, healthSport, healthNutrition, healthSleep, healthTension, triggers, relationships, energy, checkins }
}
