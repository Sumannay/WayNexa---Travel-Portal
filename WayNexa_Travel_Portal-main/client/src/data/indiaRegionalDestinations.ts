import type { Destination, GeoPlace } from "./catalog";
import { indiaDestinationPhotos, type IndiaDestinationPhoto } from "./indiaDestinationPhotos";

type DestinationSeed = {
  id: string;
  name: string;
  region: string;
  category: string;
  photoId: string;
  places: number;
  fromPrice: number;
  bestTime: string;
  description: string;
  thingsToDo: string[];
  foods: string[];
  travelTips: string[];
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

const photoCredits: Partial<Record<string, IndiaDestinationPhoto>> = {
  ...indiaDestinationPhotos,
  tawang: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Sela_Tunnel_In_Arunachal_Pradesh%2C_India.jpg/1280px-Sela_Tunnel_In_Arunachal_Pradesh%2C_India.jpg",
    label: "Photo: Ministry of Defence via Wikimedia Commons (GODL-India)",
    href: "https://commons.wikimedia.org/wiki/File:Sela_Tunnel_In_Arunachal_Pradesh,_India.jpg",
  },
  "bodh-gaya": {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Nyingma_monastery_in_Bodhgaya%2C_Bihar%2C_India_08.jpg/1280px-Nyingma_monastery_in_Bodhgaya%2C_Bihar%2C_India_08.jpg",
    label: "Photo: Amitabha Gupta via Wikimedia Commons (CC BY 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Nyingma_monastery_in_Bodhgaya,_Bihar,_India_08.jpg",
  },
  rajgir: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Japanese_Temple_premises_at_Rajgir_in_Bihar%2C_India_21.jpg/1280px-Japanese_Temple_premises_at_Rajgir_in_Bihar%2C_India_21.jpg",
    label: "Photo: Amitabha Gupta via Wikimedia Commons (CC BY 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Japanese_Temple_premises_at_Rajgir_in_Bihar,_India_21.jpg",
  },
  chitrakote: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Chitrakote_Falls%2C_Chhattisgarh_%28December_2024%29.jpg/1280px-Chitrakote_Falls%2C_Chhattisgarh_%28December_2024%29.jpg",
    label: "Photo: Jashapd1 via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Chitrakote_Falls,_Chhattisgarh_(December_2024).jpg",
  },
  barnawapara: {
    image: "https://upload.wikimedia.org/wikipedia/commons/1/15/Barnawapara_Wildlife_Sanctuary_Chhattisgarh_India.jpg",
    label: "Photo: RameshSharma1 via Wikimedia Commons (CC BY 2.0)",
    href: "https://commons.wikimedia.org/wiki/File:Barnawapara_Wildlife_Sanctuary_Chhattisgarh_India.jpg",
  },
  kurukshetra: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Haryana_tableaux_at_Republic_Day_Parade_2025_Showcasing_Bhagavad_Gita.jpg/1280px-Haryana_tableaux_at_Republic_Day_Parade_2025_Showcasing_Bhagavad_Gita.jpg",
    label: "Photo: Prime Minister's Office, Government of India via Wikimedia Commons (EdictGov-India)",
    href: "https://commons.wikimedia.org/wiki/File:Haryana_tableaux_at_Republic_Day_Parade_2025_Showcasing_Bhagavad_Gita.jpg",
  },
  sultanpur: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Siberian_Stonechat%2C_Sultanpur_National_Park%2C_Haryana%2C_India.jpg/1280px-Siberian_Stonechat%2C_Sultanpur_National_Park%2C_Haryana%2C_India.jpg",
    label: "Photo: Gautamswati via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Siberian_Stonechat,_Sultanpur_National_Park,_Haryana,_India.jpg",
  },
  visakhapatnam: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Sunset_at_RK_Beach_in_Visakhapatnam.jpg/1280px-Sunset_at_RK_Beach_in_Visakhapatnam.jpg",
    label: "Photo: Adityamadhav83 via Wikimedia Commons (CC BY-SA 3.0)",
    href: "https://commons.wikimedia.org/wiki/File:Sunset_at_RK_Beach_in_Visakhapatnam.jpg",
  },
  "araku-valley": {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Araku_Valley_coffee_plantations_in_Ananthagiri_hills_in_Andhra_Pradesh_04.jpg/1280px-Araku_Valley_coffee_plantations_in_Ananthagiri_hills_in_Andhra_Pradesh_04.jpg",
    label: "Photo: Pinakpani via Wikimedia Commons (CC BY 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Araku_Valley_coffee_plantations_in_Ananthagiri_hills_in_Andhra_Pradesh_04.jpg",
  },
  deoghar: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Baidyanath_Jyotirling_Temple%2C_Deoghar%2C_Jharkhand.jpg/1280px-Baidyanath_Jyotirling_Temple%2C_Deoghar%2C_Jharkhand.jpg",
    label: "Photo: Kakarrote via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Baidyanath_Jyotirling_Temple,_Deoghar,_Jharkhand.jpg",
  },
  adilog: {
    image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Kuntala-waterfalls1.jpg",
    label: "Photo: Ppavan1 via Wikimedia Commons (CC BY-SA 3.0)",
    href: "https://commons.wikimedia.org/wiki/File:Kuntala-waterfalls1.jpg",
  },
  somnath: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f2/Shree_Somnath_Temple.jpg/1280px-Shree_Somnath_Temple.jpg",
    label: "Photo: Prime Minister's Office, Government of India via Wikimedia Commons (GODL-India)",
    href: "https://commons.wikimedia.org/wiki/File:Shree_Somnath_Temple.jpg",
  },
  "port-blair": {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Cellular_Jail%2C_Andaman_%26_Nicobar%2C_Port_Blair%2C_India%2C_night_view.jpg/1280px-Cellular_Jail%2C_Andaman_%26_Nicobar%2C_Port_Blair%2C_India%2C_night_view.jpg",
    label: "Photo: Harvinder Chandigarh via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Cellular_Jail,_Andaman_%26_Nicobar,_Port_Blair,_India,_night_view.jpg",
  },
  ooty: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/SE_Club_Hill_Ooty_Aug25_A7CR_07193.jpg/1280px-SE_Club_Hill_Ooty_Aug25_A7CR_07193.jpg",
    label: "Photo: Timothy A. Gonsalves via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:SE_Club_Hill_Ooty_Aug25_A7CR_07193.jpg",
  },
  pachmarhi: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Pachmarhi_valley_Madhya_Pradesh_INDIA.jpg/1280px-Pachmarhi_valley_Madhya_Pradesh_INDIA.jpg",
    label: "Photo: Abhayashok via Wikimedia Commons (CC BY-SA 3.0)",
    href: "https://commons.wikimedia.org/wiki/File:Pachmarhi_valley_Madhya_Pradesh_INDIA.jpg",
  },
  "loktak-lake": {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Loktak_Lake_Manipur_01.jpg/1280px-Loktak_Lake_Manipur_01.jpg",
    label: "Photo: ch_15march via Wikimedia Commons (CC BY 2.0)",
    href: "https://commons.wikimedia.org/wiki/File:Loktak_Lake_Manipur_01.jpg",
  },
  "dzukou-valley": {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/A_site_of_Dzukou_Valley%2C_located_in_Manipur-Nagaland_border.jpg/1280px-A_site_of_Dzukou_Valley%2C_located_in_Manipur-Nagaland_border.jpg",
    label: "Photo: Akhyay via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:A_site_of_Dzukou_Valley,_located_in_Manipur-Nagaland_border.jpg",
  },
  diu: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Diu_Fort_view.jpg/1280px-Diu_Fort_view.jpg",
    label: "Photo: Chirag Godhaniya via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Diu_Fort_view.jpg",
  },
  dharamshala: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Ghoomakad_hut_overlooking_the_Dhauladhars_and_Dharamshala.jpg/1280px-Ghoomakad_hut_overlooking_the_Dhauladhars_and_Dharamshala.jpg",
    label: "Photo: Planemad via Wikimedia Commons (CC BY-SA 3.0)",
    href: "https://commons.wikimedia.org/wiki/File:Ghoomakad_hut_overlooking_the_Dhauladhars_and_Dharamshala.jpg",
  },
  alappuzha: {
    image: "https://upload.wikimedia.org/wikipedia/commons/8/88/House_Boat_in_morning%2C_Alappuzha%2C_Kerala.jpg",
    label: "Photo: Devender Goyal via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:House_Boat_in_morning,_Alappuzha,_Kerala.jpg",
  },
  wayanad: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Soochipara_Falls%2C_Wayanad_Kerala%2C_2013_%28Landscape%29.jpeg/1280px-Soochipara_Falls%2C_Wayanad_Kerala%2C_2013_%28Landscape%29.jpeg",
    label: "Photo: Yjenith via Wikimedia Commons (CC BY-SA 3.0)",
    href: "https://commons.wikimedia.org/wiki/File:Soochipara_Falls,_Wayanad_Kerala,_2013_(Landscape).jpeg",
  },
  coorg: {
    image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Coffee_Coconuts_Pepper_Estate_Coorg_Feb24_A7C_09365.jpg/1280px-Coffee_Coconuts_Pepper_Estate_Coorg_Feb24_A7C_09365.jpg",
    label: "Photo: Timothy A. Gonsalves via Wikimedia Commons (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:Coffee_Coconuts_Pepper_Estate_Coorg_Feb24_A7C_09365.jpg",
  },
};

const seeds: DestinationSeed[] = [
  { id: "visakhapatnam", name: "Visakhapatnam", region: "Andhra Pradesh", category: "Beaches", photoId: "photo-1507525428034-b723cf961d3e", places: 12, fromPrice: 6500, bestTime: "October – March", description: "A Bay of Bengal port city with long beaches, a hilltop viewpoint and a historic submarine museum.", thingsToDo: ["RK Beach and the submarine museum", "Kailasagiri hilltop park", "Borra Caves day trip"], foods: ["Andhra meals", "Bamboo chicken", "Pootharekulu"], travelTips: ["Check beach flags before swimming and allow extra time for the coastal road."] },
  { id: "araku-valley", name: "Araku Valley", region: "Andhra Pradesh", category: "Nature", photoId: "photo-1470770841072-f978cf4d019e", places: 9, fromPrice: 7200, bestTime: "October – March", description: "A highland escape known for coffee-growing communities, forest scenery and a memorable rail journey.", thingsToDo: ["Take the scenic train from Visakhapatnam", "Visit Borra Caves", "Explore a local coffee museum"], foods: ["Araku coffee", "Bamboo chicken", "Ragi dishes"], travelTips: ["Book train seats ahead of weekends and carry a light layer for cool evenings."] },
  { id: "tawang", name: "Tawang", region: "Arunachal Pradesh", category: "Mountains", photoId: "photo-1464822759023-fed622ff2c3b", places: 11, fromPrice: 12500, bestTime: "April – October", description: "A remote Himalayan town of mountain passes, high-altitude lakes and a major Buddhist monastery.", thingsToDo: ["Tawang Monastery", "Sela Pass and its viewpoints", "Nuranang Falls"], foods: ["Thukpa", "Momos", "Zan"], travelTips: ["Confirm current permit requirements and road conditions before setting out."] },
  { id: "ziro-valley", name: "Ziro Valley", region: "Arunachal Pradesh", category: "Culture", photoId: "photo-1500534623283-312aade485b7", places: 8, fromPrice: 11000, bestTime: "March – October", description: "A green plateau of paddy fields, pine-covered hills and Apatani cultural heritage.", thingsToDo: ["Walk through Apatani villages", "Visit the Talley Valley area with a local guide", "Explore the old Ziro plateau"], foods: ["Smoked pork", "Bamboo-shoot dishes", "Local millet"], travelTips: ["Respect village customs and verify festival dates and entry arrangements locally."] },
  { id: "bodh-gaya", name: "Bodh Gaya", region: "Bihar", category: "Spiritual", photoId: "photo-1548013146-72479768bada", places: 10, fromPrice: 5800, bestTime: "October – March", description: "One of Buddhism's most important pilgrimage centres, with the Mahabodhi Temple at its heart.", thingsToDo: ["Mahabodhi Temple complex", "International monasteries", "Great Buddha Statue"], foods: ["Litti chokha", "Thekua", "Local thali"], travelTips: ["Dress modestly at religious sites and observe quiet-zone guidance."] },
  { id: "rajgir", name: "Rajgir", region: "Bihar", category: "Heritage", photoId: "photo-1501785888041-af3ef285b470", places: 9, fromPrice: 5200, bestTime: "October – March", description: "A historic valley town linked to ancient Buddhist and Jain traditions, surrounded by wooded hills.", thingsToDo: ["Ride the Rajgir Ropeway", "Visit Vishwa Shanti Stupa", "Explore the ancient cycle route and hot springs"], foods: ["Bihari thali", "Malpua", "Khaja"], travelTips: ["Start hill visits early and check ropeway operating hours in advance."] },
  { id: "chitrakote", name: "Chitrakote Falls", region: "Chhattisgarh", category: "Nature", photoId: "photo-1473116763249-2faaef81ccda", places: 7, fromPrice: 6800, bestTime: "July – February", description: "A broad waterfall on the Indravati River, particularly dramatic during and after the monsoon.", thingsToDo: ["View the falls from the main viewpoints", "Visit nearby Tirathgarh Falls", "Explore Bastar craft traditions with local guides"], foods: ["Chana samosa", "Bafauri", "Bastar-style tribal dishes"], travelTips: ["Stay behind marked barriers around slippery rocks and verify seasonal road access."] },
  { id: "barnawapara", name: "Barnawapara Wildlife Sanctuary", region: "Chhattisgarh", category: "Wildlife", photoId: "photo-1472396961693-142e6e269027", places: 6, fromPrice: 6200, bestTime: "November – June", description: "A forest and grassland reserve offering a quieter introduction to central India's wildlife habitats.", thingsToDo: ["Arrange an authorised nature drive", "Watch for birds from designated areas", "Visit nearby rural craft communities"], foods: ["Chila", "Faraa", "Local rice dishes"], travelTips: ["Use authorised guides and confirm sanctuary entry schedules before travel."] },
  { id: "kurukshetra", name: "Kurukshetra", region: "Haryana", category: "Heritage", photoId: "photo-1564013799919-ab600027ffc6", places: 8, fromPrice: 4800, bestTime: "October – March", description: "A pilgrimage and learning centre with sacred tanks, museums and sites associated with the Mahabharata.", thingsToDo: ["Brahma Sarovar", "Krishna Museum", "Jyotisar"], foods: ["Bajra roti", "Haryanvi kadhi", "Churma"], travelTips: ["Check museum and temple timings as they differ by site and day."] },
  { id: "sultanpur", name: "Sultanpur National Park", region: "Haryana", category: "Wildlife", photoId: "photo-1441974231531-c6227db76b6b", places: 5, fromPrice: 4300, bestTime: "November – February", description: "A wetland bird sanctuary within reach of Delhi, best known for its winter migratory birds.", thingsToDo: ["Walk the marked birding trails", "Visit the interpretation centre", "Join a guided birdwatching session"], foods: ["Bajra roti", "Kachri chutney", "Local dairy sweets"], travelTips: ["Bring binoculars, keep noise low and check park opening days before departure."] },
  { id: "ranchi", name: "Ranchi", region: "Jharkhand", category: "Nature", photoId: "photo-1433086966358-54859d0ed716", places: 9, fromPrice: 5200, bestTime: "October – March", description: "Jharkhand's capital is a gateway to forested plateaus, waterfalls and regional tribal culture.", thingsToDo: ["Hundru Falls", "Rock Garden and Kanke Dam", "Tagore Hill"], foods: ["Dhuska", "Rugra mushroom", "Thekua"], travelTips: ["Waterfalls are seasonal; keep to signed paths and avoid swimming in strong currents."] },
  { id: "deoghar", name: "Deoghar", region: "Jharkhand", category: "Spiritual", photoId: "photo-1605640840605-14ac1855827b", places: 7, fromPrice: 4900, bestTime: "October – March", description: "A major pilgrimage town centred on the Baidyanath Jyotirlinga and surrounded by wooded hills.", thingsToDo: ["Baidyanath Temple", "Trikut Hills", "Nandan Pahar"], foods: ["Peda", "Litti chokha", "Seasonal local sweets"], travelTips: ["Expect heavy crowds during Shravan and follow official temple queue guidance."] },
  { id: "khajuraho", name: "Khajuraho", region: "Madhya Pradesh", category: "Heritage", photoId: "photo-1599661046289-e31897846e41", places: 12, fromPrice: 7900, bestTime: "October – March", description: "A UNESCO-listed temple town celebrated for its finely carved medieval architecture.", thingsToDo: ["Western Group of Temples", "Eastern Group of Temples", "Panna National Park day trip"], foods: ["Bundeli cuisine", "Dal bafla", "Mawa bati"], travelTips: ["Allow time for several temple groups and use site maps to plan the visit."] },
  { id: "pachmarhi", name: "Pachmarhi", region: "Madhya Pradesh", category: "Nature", photoId: "photo-1500530855697-b586d89ba3ee", places: 11, fromPrice: 7400, bestTime: "October – June", description: "A forested hill station in the Satpura range with waterfalls, caves and sandstone viewpoints.", thingsToDo: ["Bee Falls", "Dhoopgarh sunset", "Pandav Caves"], foods: ["Bhutte ka kees", "Dal bafla", "Poha"], travelTips: ["Check forest access rules and use registered local transport for protected areas."] },
  { id: "sanchi", name: "Sanchi", region: "Madhya Pradesh", category: "Heritage", photoId: "photo-1518709268805-4e9042af9f23", places: 7, fromPrice: 5600, bestTime: "October – March", description: "A peaceful heritage site anchored by the Great Stupa and an exceptional collection of Buddhist monuments.", thingsToDo: ["Great Stupa", "Sanchi Archaeological Museum", "Udayagiri Caves"], foods: ["Bhopali kebabs", "Poha", "Madhya Pradesh thali"], travelTips: ["Pair the site with a day in nearby Bhopal and check museum hours."] },
  { id: "loktak-lake", name: "Loktak Lake", region: "Manipur", category: "Nature", photoId: "photo-1470252649378-9c29740c9fa8", places: 8, fromPrice: 7000, bestTime: "October – March", description: "The Northeast's largest freshwater lake, known for floating phumdis and the Keibul Lamjao wetland.", thingsToDo: ["View the lake from Sendra", "Take a locally arranged boat visit", "Explore Keibul Lamjao National Park with permission"], foods: ["Eromba", "Singju", "Iromba"], travelTips: ["Use permitted viewpoints and never disturb floating habitat or wildlife."] },
  { id: "imphal", name: "Imphal", region: "Manipur", category: "Culture", photoId: "photo-1511497584788-876760111969", places: 8, fromPrice: 6500, bestTime: "October – March", description: "Manipur's capital blends a distinctive living culture, historic memorials and a remarkable women-run market.", thingsToDo: ["Ima Keithel market", "Kangla Fort", "Manipur State Museum"], foods: ["Eromba", "Chamthong", "Black rice pudding"], travelTips: ["Ask permission before photographing people and check current local travel advice."] },
  { id: "shillong", name: "Shillong", region: "Meghalaya", category: "Mountains", photoId: "photo-1500534623283-312aade485b7", places: 10, fromPrice: 7600, bestTime: "October – April", description: "A lively hill city and base for Meghalaya's viewpoints, caves and waterfalls.", thingsToDo: ["Umiam Lake", "Don Bosco Museum", "Shillong Peak viewpoint"], foods: ["Jadoh", "Dohneiiong", "Tungrymbai"], travelTips: ["Leave extra time for hill roads and changing monsoon weather."] },
  { id: "cherrapunji", name: "Sohra (Cherrapunji)", region: "Meghalaya", category: "Nature", photoId: "photo-1433086966358-54859d0ed716", places: 12, fromPrice: 8400, bestTime: "October – May", description: "Sohra's escarpments, caves and seasonal waterfalls reveal Meghalaya's dramatic limestone landscape.", thingsToDo: ["Nohkalikai Falls viewpoint", "Mawsmai Cave", "Arrange a guided walk to a living root bridge"], foods: ["Jadoh", "Pumaloi", "Local smoked meats"], travelTips: ["Root-bridge walks involve steep steps; carry water and check trail conditions."] },
  { id: "dawki", name: "Dawki and the Umngot", region: "Meghalaya", category: "Adventure", photoId: "photo-1501785888041-af3ef285b470", places: 6, fromPrice: 7900, bestTime: "November – April", description: "A riverside border town popular for clear-water scenery and boat trips when conditions allow.", thingsToDo: ["Take a locally permitted Umngot boat ride", "Visit nearby Shnongpdeng", "Explore the Dawki bridge and market"], foods: ["Jadoh", "Local fish", "Seasonal Khasi dishes"], travelTips: ["Water clarity varies by season; follow boat safety instructions and border-area rules."] },
  { id: "aizawl", name: "Aizawl", region: "Mizoram", category: "Culture", photoId: "photo-1519681393784-d120267933ba", places: 7, fromPrice: 7100, bestTime: "October – March", description: "A hilltop capital of lively markets, Mizo heritage and layered valley viewpoints.", thingsToDo: ["Mizoram State Museum", "Bara Bazar", "Durtlang Hills viewpoint"], foods: ["Bai", "Misa mach poora", "Sawhchiar"], travelTips: ["Expect steep streets and check permit rules for visitors before travel."] },
  { id: "reiek", name: "Reiek", region: "Mizoram", category: "Adventure", photoId: "photo-1500534623283-312aade485b7", places: 5, fromPrice: 6700, bestTime: "October – April", description: "A mountain village and forested peak near Aizawl with traditional Mizo architecture and walking trails.", thingsToDo: ["Walk the Reiek Tlang trail", "Visit the heritage village", "Look for valley viewpoints on a clear day"], foods: ["Bai", "Mizo rice dishes", "Local smoked vegetables"], travelTips: ["Use a local guide for longer walks and check weather before heading uphill."] },
  { id: "kohima", name: "Kohima", region: "Nagaland", category: "Culture", photoId: "photo-1519681393784-d120267933ba", places: 8, fromPrice: 7800, bestTime: "October – April", description: "Nagaland's hill capital is known for living Naga culture and an important Second World War memorial.", thingsToDo: ["Kohima War Cemetery", "Kisama Heritage Village", "Local market and craft visit"], foods: ["Smoked pork with bamboo shoot", "Galho", "Axone dishes"], travelTips: ["Confirm entry requirements and festival dates; ask before photographing residents."] },
  { id: "dzukou-valley", name: "Dzukou Valley", region: "Nagaland", category: "Adventure", photoId: "photo-1470770841072-f978cf4d019e", places: 5, fromPrice: 8800, bestTime: "June – September", description: "A high-altitude valley of seasonal flowers and open ridgelines reached by a demanding hike.", thingsToDo: ["Choose an authorised trailhead", "Arrange a local guide and overnight plan", "Follow leave-no-trace practices"], foods: ["Naga rice dishes", "Smoked meats", "Axone"], travelTips: ["This is a strenuous trek; check weather, permits, water and shelter conditions beforehand."] },
  { id: "amritsar", name: "Amritsar", region: "Punjab", category: "Culture", photoId: "photo-1609947017136-9daf32a5eb16", places: 10, fromPrice: 6500, bestTime: "October – March", description: "A historic Punjab city centred on the Golden Temple, generous community kitchens and rich cuisine.", thingsToDo: ["Sri Harmandir Sahib", "Jallianwala Bagh", "Partition Museum"], foods: ["Amritsari kulcha", "Chole", "Lassi"], travelTips: ["Follow the shrine's head-covering and footwear rules and keep visit plans respectful."] },
  { id: "anandpur-sahib", name: "Anandpur Sahib", region: "Punjab", category: "Spiritual", photoId: "photo-1605640840605-14ac1855827b", places: 6, fromPrice: 5300, bestTime: "October – March", description: "A significant Sikh heritage town framed by the Shivalik foothills and historic gurdwaras.", thingsToDo: ["Takht Sri Kesgarh Sahib", "Virasat-e-Khalsa museum", "Riverside foothill viewpoints"], foods: ["Makki di roti", "Sarson da saag", "Punjabi langar"], travelTips: ["Check museum hours and dress respectfully when visiting religious places."] },
  { id: "chennai", name: "Chennai", region: "Tamil Nadu", category: "Culture", photoId: "photo-1519046904884-53103b34b206", places: 12, fromPrice: 7200, bestTime: "November – February", description: "A coastal metropolis of classical arts, historic temples, museums and a long urban shoreline.", thingsToDo: ["Kapaleeshwarar Temple", "Fort St. George Museum", "Marina Beach promenade"], foods: ["Idli and sambar", "Chettinad meals", "Filter coffee"], travelTips: ["The shoreline has strong currents; use only designated bathing areas."] },
  { id: "madurai", name: "Madurai", region: "Tamil Nadu", category: "Spiritual", photoId: "photo-1605640840605-14ac1855827b", places: 10, fromPrice: 6400, bestTime: "October – March", description: "A temple city with a celebrated Dravidian landmark, historic markets and a distinctive food scene.", thingsToDo: ["Meenakshi Amman Temple", "Thirumalai Nayakkar Mahal", "Gandhi Memorial Museum"], foods: ["Jigarthanda", "Kari dosa", "Paruthi paal"], travelTips: ["Temple timings can change for rituals; check official notices before your visit."] },
  { id: "ooty", name: "Ooty", region: "Tamil Nadu", category: "Mountains", photoId: "photo-1500530855697-b586d89ba3ee", places: 10, fromPrice: 8200, bestTime: "October – June", description: "A Nilgiri hill station of tea gardens, botanical collections and a heritage mountain railway.", thingsToDo: ["Ride the Nilgiri Mountain Railway", "Government Botanical Garden", "Doddabetta viewpoint"], foods: ["Nilgiri tea", "Homemade chocolates", "Kongunadu meals"], travelTips: ["Book the heritage train early and allow extra time on winding roads."] },
  { id: "rameswaram", name: "Rameswaram", region: "Tamil Nadu", category: "Spiritual", photoId: "photo-1507525428034-b723cf961d3e", places: 8, fromPrice: 7800, bestTime: "October – April", description: "An island pilgrimage town known for its temple corridor, coastal landscapes and Pamban crossing.", thingsToDo: ["Ramanathaswamy Temple", "Pamban Bridge viewpoints", "Dhanushkodi with permitted local transport"], foods: ["South Indian meals", "Seafood", "Paniyaram"], travelTips: ["Check local restrictions and weather before visiting the exposed Dhanushkodi area."] },
  { id: "hyderabad", name: "Hyderabad", region: "Telangana", category: "Heritage", photoId: "photo-1599661046289-e31897846e41", places: 12, fromPrice: 7200, bestTime: "October – March", description: "A Deccan city of landmark architecture, historic bazaars, museums and a celebrated food culture.", thingsToDo: ["Charminar and Laad Bazaar", "Golconda Fort", "Salar Jung Museum"], foods: ["Hyderabadi biryani", "Haleem", "Irani chai"], travelTips: ["Visit outdoor forts early and check museum entry schedules."] },
  { id: "warangal", name: "Warangal", region: "Telangana", category: "Heritage", photoId: "photo-1564507592333-c60657eea523", places: 8, fromPrice: 5800, bestTime: "October – March", description: "A Kakatiya heritage centre with sculpted gateways, a historic fort and a large temple tank.", thingsToDo: ["Warangal Fort", "Thousand Pillar Temple", "Ramappa Temple day trip"], foods: ["Sarva pindi", "Sakinalu", "Telangana thali"], travelTips: ["Check protected-site opening hours and carry sun protection for the fort grounds."] },
  { id: "adilog", name: "Adilabad", region: "Telangana", category: "Nature", photoId: "photo-1433086966358-54859d0ed716", places: 6, fromPrice: 5500, bestTime: "October – February", description: "A northern Telangana base for forest landscapes, waterfalls and regional tribal heritage.", thingsToDo: ["Kuntala Falls", "Pochera Falls", "Explore local craft and culture with a guide"], foods: ["Jonna rotte", "Sarva pindi", "Telangana home-style meals"], travelTips: ["Waterfall access is seasonal; check local safety and road conditions first."] },
  { id: "agartala", name: "Agartala", region: "Tripura", category: "Heritage", photoId: "photo-1564013799919-ab600027ffc6", places: 7, fromPrice: 5700, bestTime: "October – March", description: "Tripura's capital pairs royal architecture and museums with nearby lakeside excursions.", thingsToDo: ["Ujjayanta Palace Museum", "Heritage walk around the old city", "Visit the Sepahijala wildlife area"], foods: ["Mui borok", "Chakhwi", "Wahan mosdeng"], travelTips: ["Confirm museum opening days and allow time for intercity road travel."] },
  { id: "neermahal", name: "Neermahal", region: "Tripura", category: "Heritage", photoId: "photo-1501785888041-af3ef285b470", places: 5, fromPrice: 5200, bestTime: "October – March", description: "A lake palace on Rudrasagar Lake, combining royal architecture with a tranquil wetland setting.", thingsToDo: ["Visit the palace by authorised boat", "Explore Melaghar", "Watch the lake from permitted viewpoints"], foods: ["Mui borok", "Chakhwi", "Local fish curry"], travelTips: ["Boat access depends on weather and operating hours; confirm locally."] },
  { id: "chandigarh", name: "Chandigarh", region: "Chandigarh", category: "Culture", photoId: "photo-1511818966892-d7d671e672a2", places: 9, fromPrice: 5700, bestTime: "October – March", description: "A planned city known for modernist architecture, landscaped gardens and a lively lakefront.", thingsToDo: ["Rock Garden", "Capitol Complex with authorised access", "Sukhna Lake"], foods: ["Punjabi chole bhature", "Amritsari kulcha", "North Indian thali"], travelTips: ["Check visiting arrangements for the Capitol Complex before travelling."] },
  { id: "diu", name: "Diu", region: "Dadra and Nagar Haveli and Daman and Diu", category: "Beaches", photoId: "photo-1519046904884-53103b34b206", places: 8, fromPrice: 7200, bestTime: "November – February", description: "A relaxed Arabian Sea island destination with Portuguese-era fortifications and coastal viewpoints.", thingsToDo: ["Diu Fort", "Naida Caves", "Nagoa Beach"], foods: ["Seafood curry", "Gujarati thali", "Coconut sweets"], travelTips: ["Use marked swimming areas and confirm ferry or flight schedules before connecting."] },
  { id: "silvassa", name: "Silvassa", region: "Dadra and Nagar Haveli and Daman and Diu", category: "Nature", photoId: "photo-1511497584788-876760111969", places: 6, fromPrice: 5300, bestTime: "November – February", description: "A green western-India getaway with riverside scenery, gardens and tribal heritage collections.", thingsToDo: ["Dudhni waterfront", "Tribal Cultural Museum", "Vanganga Lake Garden"], foods: ["Gujarati thali", "Ubadiyu", "Local forest produce"], travelTips: ["Check seasonal water activities with authorised operators and follow wildlife-area rules."] },
  { id: "new-delhi", name: "New Delhi", region: "Delhi", category: "Heritage", photoId: "photo-1564013799919-ab600027ffc6", places: 15, fromPrice: 7200, bestTime: "October – March", description: "India's capital is a vast museum of historic quarters, monumental avenues, markets and contemporary culture.", thingsToDo: ["Humayun's Tomb", "Qutub Minar", "Old Delhi and Jama Masjid"], foods: ["Chaat", "Parathas", "Mughlai dishes"], travelTips: ["Plan for summer heat and use official ticketing channels at major monuments."] },
  { id: "mehrauli", name: "Mehrauli Archaeological Park", region: "Delhi", category: "Heritage", photoId: "photo-1605640840605-14ac1855827b", places: 7, fromPrice: 4900, bestTime: "October – March", description: "An expansive historic landscape revealing centuries of Delhi's monuments beside modern neighbourhoods.", thingsToDo: ["Walk the marked archaeological park paths", "Visit Qutub Minar nearby", "Explore the historic stepwells with respect for site rules"], foods: ["Delhi chaat", "Kebabs", "Seasonal street food"], travelTips: ["Visit in daylight, carry water and stay on public paths."] },
  { id: "agatti", name: "Agatti Island", region: "Lakshadweep", category: "Beaches", photoId: "photo-1519046904884-53103b34b206", places: 5, fromPrice: 18000, bestTime: "October – March", description: "A coral-island gateway to Lakshadweep's clear lagoons, subject to strict visitor permits.", thingsToDo: ["Enjoy permitted lagoon activities", "Arrange a licensed local boat trip", "Learn about reef conservation"], foods: ["Tuna dishes", "Coconut curries", "Local rice meals"], travelTips: ["Obtain required permits and confirmed transport before booking; protect fragile reefs."] },
  { id: "bangaram", name: "Bangaram Island", region: "Lakshadweep", category: "Beaches", photoId: "photo-1507525428034-b723cf961d3e", places: 4, fromPrice: 22000, bestTime: "October – March", description: "A small coral island reached through approved Lakshadweep travel arrangements and sensitive to visitor impact.", thingsToDo: ["Join permitted reef-safe snorkelling", "Walk the island shoreline", "Observe the lagoon without disturbing marine life"], foods: ["Fresh tuna", "Coconut rice", "Local seafood"], travelTips: ["Confirm current permits and accommodation availability; never touch coral or wildlife."] },
  { id: "puducherry", name: "Puducherry", region: "Puducherry", category: "Culture", photoId: "photo-1519046904884-53103b34b206", places: 10, fromPrice: 7600, bestTime: "November – February", description: "A coastal town of Tamil heritage, French-era streets, spiritual centres and a walkable seafront.", thingsToDo: ["White Town heritage walk", "Basilica of the Sacred Heart", "Promenade Beach at sunrise"], foods: ["Pondicherry fish curry", "French-inspired bakeries", "South Indian meals"], travelTips: ["The seafront is for viewing, not swimming; use safe, lifeguarded beaches elsewhere."] },
  { id: "auroville", name: "Auroville", region: "Puducherry", category: "Culture", photoId: "photo-1441974231531-c6227db76b6b", places: 6, fromPrice: 6900, bestTime: "November – February", description: "An international community near Puducherry with visitor access arranged through its official visitor services.", thingsToDo: ["Book Matrimandir viewing access in advance", "Visit the visitor centre", "Explore local workshops and cafés"], foods: ["Community café meals", "South Indian cuisine", "Plant-based food"], travelTips: ["Check official visitor rules and reserve Matrimandir access before arrival."] },
  { id: "dharamshala", name: "Dharamshala and McLeod Ganj", region: "Himachal Pradesh", category: "Mountains", photoId: "photo-1464822759023-fed622ff2c3b", places: 11, fromPrice: 8900, bestTime: "March – June, September – November", description: "A Himalayan foothill town with Tibetan cultural institutions, forest paths and mountain views.", thingsToDo: ["Tsuglagkhang Complex", "Bhagsu waterfall trail", "Norbulingka Institute"], foods: ["Thukpa", "Momos", "Tibetan bread"], travelTips: ["Mountain weather changes quickly; use marked trails and check monsoon conditions."] },
  { id: "spiti-valley", name: "Spiti Valley", region: "Himachal Pradesh", category: "Adventure", photoId: "photo-1519681393784-d120267933ba", places: 10, fromPrice: 15900, bestTime: "June – September", description: "A high-altitude cold-desert circuit of monasteries, villages and stark Himalayan landscapes.", thingsToDo: ["Key Monastery", "Tabo Monastery", "Drive the valley only after checking road access"], foods: ["Thukpa", "Chha meat", "Butter tea"], travelTips: ["Acclimatise gradually and confirm road and weather conditions before each leg."] },
  { id: "jaisalmer", name: "Jaisalmer", region: "Rajasthan", category: "Heritage", photoId: "photo-1473580044384-7ba9967e16a0", places: 11, fromPrice: 9600, bestTime: "October – March", description: "A golden-sandstone desert city with a living fort, havelis and carefully managed desert excursions.", thingsToDo: ["Jaisalmer Fort", "Patwon Ki Haveli", "Join a responsible Sam sand-dune excursion"], foods: ["Ker sangri", "Gatte ki sabzi", "Ghotua laddu"], travelTips: ["Choose licensed desert operators and avoid littering fragile dune habitats."] },
  { id: "jodhpur", name: "Jodhpur", region: "Rajasthan", category: "Heritage", photoId: "photo-1599661046289-e31897846e41", places: 10, fromPrice: 8700, bestTime: "October – March", description: "The Blue City's lanes unfold beneath Mehrangarh Fort, with stepwells and lively old-town markets.", thingsToDo: ["Mehrangarh Fort", "Jaswant Thada", "Toorji Ka Jhalra stepwell"], foods: ["Mirchi vada", "Makhaniya lassi", "Mawa kachori"], travelTips: ["Wear sun protection and use licensed guides inside heritage sites."] },
  { id: "alappuzha", name: "Alappuzha", region: "Kerala", category: "Nature", photoId: "photo-1510414842594-a61c69b5ae57", places: 9, fromPrice: 8900, bestTime: "October – March", description: "A Kerala backwater town of canals, lagoons and carefully regulated houseboat journeys.", thingsToDo: ["Arrange a licensed backwater cruise", "Visit Alappuzha Beach", "Explore local coir-making traditions"], foods: ["Karimeen pollichathu", "Appam and stew", "Kerala sadya"], travelTips: ["Confirm safety equipment and responsible-waste policies with boat operators."] },
  { id: "wayanad", name: "Wayanad", region: "Kerala", category: "Nature", photoId: "photo-1441974231531-c6227db76b6b", places: 10, fromPrice: 8400, bestTime: "October – May", description: "A Western Ghats district of forest reserves, spice-growing slopes, caves and waterfalls.", thingsToDo: ["Edakkal Caves", "Banasura Sagar Dam", "Choose a permitted guided wildlife experience"], foods: ["Malabar biryani", "Puttu and kadala", "Local banana dishes"], travelTips: ["Check monsoon trail closures and never enter wildlife areas without authorisation."] },
  { id: "coorg", name: "Coorg (Kodagu)", region: "Karnataka", category: "Nature", photoId: "photo-1497250681960-ef046c08a56e", places: 9, fromPrice: 7900, bestTime: "October – March", description: "A coffee and spice-growing hill region of forest trails, waterfalls and Kodava culture.", thingsToDo: ["Abbey Falls", "Madikeri Fort", "Visit a responsible local coffee estate"], foods: ["Pandi curry", "Kadambuttu", "Coorg coffee"], travelTips: ["Waterfall and forest access varies by season; check local trail conditions."] },
  { id: "pune", name: "Pune", region: "Maharashtra", category: "Culture", photoId: "photo-1590050752117-23a9d7fc6cfe", places: 10, fromPrice: 6500, bestTime: "October – February", description: "A Deccan city that combines Maratha-era heritage, museums, lively neighbourhoods and nearby hill country.", thingsToDo: ["Aga Khan Palace", "Shaniwar Wada", "Raja Dinkar Kelkar Museum"], foods: ["Misal pav", "Mastani", "Puran poli"], travelTips: ["Leave extra time for city traffic and check fort access before weekend excursions."] },
  { id: "ajanta-ellora", name: "Ajanta and Ellora", region: "Maharashtra", category: "Heritage", photoId: "photo-1564507592333-c60657eea523", places: 12, fromPrice: 8800, bestTime: "October – March", description: "UNESCO-listed cave complexes preserve extraordinary Buddhist, Hindu and Jain art and architecture.", thingsToDo: ["Ajanta Caves", "Ellora Caves and Kailasa Temple", "Daulatabad Fort"], foods: ["Maharashtrian thali", "Naan Qalia", "Puran poli"], travelTips: ["The two cave sites are separate day trips; check weekly closures and site rules."] },
  { id: "sundarbans", name: "Sundarbans", region: "West Bengal", category: "Wildlife", photoId: "photo-1472396961693-142e6e269027", places: 8, fromPrice: 10500, bestTime: "November – February", description: "A vast mangrove delta best visited with authorised operators and strong wildlife safeguards.", thingsToDo: ["Book a permitted guided boat safari", "Visit an approved interpretation centre", "Explore the delta's local communities respectfully"], foods: ["Bengali fish curry", "Prawn malai curry", "Mishti doi"], travelTips: ["Use registered guides, follow wildlife instructions and confirm seasonal access."] },
  { id: "mandarmani", name: "Mandarmani", region: "West Bengal", category: "Beaches", photoId: "photo-1519046904884-53103b34b206", places: 5, fromPrice: 5900, bestTime: "October – February", description: "A quiet Bay of Bengal beach escape for coastal sunsets and unhurried stays.", thingsToDo: ["Walk the shoreline at low tide", "Visit nearby Shankarpur", "Try local seafood at licensed eateries"], foods: ["Bengali fish curry", "Prawn dishes", "Mishti doi"], travelTips: ["Check tide and weather conditions; do not drive vehicles on the beach."] },
  { id: "gokarna", name: "Gokarna", region: "Karnataka", category: "Beaches", photoId: "photo-1507525428034-b723cf961d3e", places: 8, fromPrice: 6800, bestTime: "October – March", description: "A coastal pilgrimage town with forest-framed beaches and a slower-paced Konkan shoreline.", thingsToDo: ["Mahabaleshwar Temple", "Kudle Beach", "Use a guide on coastal cliff trails"], foods: ["Karnataka seafood", "Neer dosa", "Local thali"], travelTips: ["Coastal trails can be exposed; avoid cliff edges and follow beach safety flags."] },
  { id: "somnath", name: "Somnath", region: "Gujarat", category: "Spiritual", photoId: "photo-1605640840605-14ac1855827b", places: 7, fromPrice: 6400, bestTime: "October – March", description: "A coastal pilgrimage town of temple heritage and open views across the Arabian Sea.", thingsToDo: ["Somnath Temple", "Triveni Sangam", "Bhalka Tirth"], foods: ["Gujarati thali", "Khichdi kadhi", "Thepla"], travelTips: ["Follow temple security guidance and observe marked sea-front safety areas."] },
  { id: "lakshadweep-kavaratti", name: "Kavaratti", region: "Lakshadweep", category: "Nature", photoId: "photo-1501785888041-af3ef285b470", places: 5, fromPrice: 19000, bestTime: "October – March", description: "The Lakshadweep capital is a sensitive coral island accessible only through approved travel arrangements.", thingsToDo: ["Visit the lagoon with a licensed guide", "Explore the marine aquarium", "Learn reef-safe visitor practices"], foods: ["Tuna curry", "Coconut-based dishes", "Local rice meals"], travelTips: ["Secure all required permits and transport before departure and protect the coral ecosystem."] },
  { id: "port-blair", name: "Sri Vijaya Puram (Port Blair)", region: "Andaman & Nicobar Islands", category: "Culture", photoId: "photo-1500375592092-40eb2168fd21", places: 8, fromPrice: 11500, bestTime: "October – May", description: "A gateway to the Andaman Islands with maritime history, island museums and protected marine habitats.", thingsToDo: ["Cellular Jail National Memorial", "Visit an approved island beach", "Explore the Samudrika Naval Marine Museum"], foods: ["Fresh seafood", "Coconut curries", "Andaman-style fish"], travelTips: ["Check inter-island permits and ferry schedules; never enter protected tribal reserves."] },
];

export const indiaRegionalDestinations: Destination[] = seeds.map((seed) => {
  const photoCredit = photoCredits[seed.id];
  return {
    ...seed,
    country: "India",
    rating: 4.6,
    image: photoCredit?.image ?? photo(seed.photoId),
    photoCredit: photoCredit ? { label: photoCredit.label, href: photoCredit.href } : undefined,
  };
});

export const indiaRegionalPlaces: GeoPlace[] = indiaRegionalDestinations.flatMap((destination) =>
  (destination.thingsToDo ?? []).map((name, index) => ({
    id: `${destination.id}-${index + 1}`,
    destinationId: destination.id,
    name,
    country: destination.country,
    state: destination.region,
    district: destination.name,
    type:
      destination.category === "Beaches"
        ? "Beach"
        : destination.category === "Nature"
          ? "Nature"
          : destination.category === "Wildlife"
            ? "Wildlife"
            : destination.category === "Adventure"
              ? "Adventure"
              : destination.category === "Spiritual"
                ? "Temple"
                : destination.category === "Culture"
                  ? "Culture"
                  : "Heritage",
    rating: destination.rating,
    description: `${name} is a featured stop in the ${destination.name} guide. Check current visitor access and local conditions before travelling.`,
    image: destination.image,
  })),
);
