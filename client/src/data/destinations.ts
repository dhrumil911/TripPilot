import { Destination } from '../types/destination';

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  country: string;
  category: 'Heritage' | 'Beach' | 'Mountains' | 'Nature' | 'Culture' | 'Spiritual' | 'Wildlife' | 'Food' | 'Adventure' | 'City';
  popularity: 'High' | 'Medium' | 'Low';
  description: string;
  query: string;
}

export const indianCitiesCatalog: CityConfig[] = [
  // Andhra Pradesh
  { id: 'c-ap-1', name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', category: 'Beach', popularity: 'High', description: 'Coastal beaches, submarine museum, and scenic Araku Valley hill roads.', query: 'Visakhapatnam beach coast India' },
  { id: 'c-ap-2', name: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Kanakadurga Temple, Undavalli caves, and scenic Krishna river views.', query: 'Vijayawada river temple India' },
  { id: 'c-ap-3', name: 'Tirupati', state: 'Andhra Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'The famous hilltop Tirumala Venkateswara temple pilgrimage site.', query: 'Tirupati Tirumala temple India' },
  { id: 'c-ap-4', name: 'Amaravati', state: 'Andhra Pradesh', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Ancient Buddhist stupas, ruins, and heritage monuments.', query: 'Amaravati stupa heritage India' },
  { id: 'c-ap-5', name: 'Guntur', state: 'Andhra Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Bustling commercial hub, chilli markets, and historical temples.', query: 'Guntur city Andhra Pradesh India' },
  { id: 'c-ap-6', name: 'Nellore', state: 'Andhra Pradesh', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Beautiful lakes, ancient temples, and coastal lagoons.', query: 'Nellore lake temple India' },
  { id: 'c-ap-7', name: 'Kurnool', state: 'Andhra Pradesh', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Konda Reddy Fort ruins, Belum Caves, and ancient rock art.', query: 'Kurnool fort caves India' },
  { id: 'c-ap-8', name: 'Rajahmundry', state: 'Andhra Pradesh', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Cultural capital on the scenic banks of the Godavari River.', query: 'Rajahmundry Godavari river India' },
  { id: 'c-ap-9', name: 'Kakinada', state: 'Andhra Pradesh', country: 'India', category: 'Food', popularity: 'Medium', description: 'Famous sweet shops, ports, and beach parks.', query: 'Kakinada seaport beach India' },

  // Arunachal Pradesh
  { id: 'c-arp-1', name: 'Itanagar', state: 'Arunachal Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Capital city with historic Ita Fort and scenic Ganga Lake.', query: 'Itanagar lake forest India' },
  { id: 'c-arp-2', name: 'Tawang', state: 'Arunachal Pradesh', country: 'India', category: 'Mountains', popularity: 'High', description: 'Grand Tawang Monastery and high snow peaks in the Himalayas.', query: 'Tawang monastery snow mountains India' },
  { id: 'c-arp-3', name: 'Bomdila', state: 'Arunachal Pradesh', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Mountain pass views, apple orchards, and peaceful Buddhist monasteries.', query: 'Bomdila mountains monastery India' },
  { id: 'c-arp-4', name: 'Ziro', state: 'Arunachal Pradesh', country: 'India', category: 'Nature', popularity: 'High', description: 'Pine hills, paddy fields, and the famous outdoor Ziro Music Festival.', query: 'Ziro valley pine hills India' },
  { id: 'c-arp-5', name: 'Pasighat', state: 'Adventure', country: 'India', category: 'Adventure', popularity: 'Medium', description: 'River rafting, waterfalls, and gateway to the Siang valley.', query: 'Pasighat river rapids India' },
  { id: 'c-arp-6', name: 'Dirang', state: 'Arunachal Pradesh', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Hot springs, apple orchards, and sheep breeding farms.', query: 'Dirang valley hills India' },

  // Assam
  { id: 'c-as-1', name: 'Guwahati', state: 'Assam', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Kamakhya Temple, Brahmaputra river cruises, and wildlife sanctuaries.', query: 'Guwahati Kamakhya Brahmaputra India' },
  { id: 'c-as-2', name: 'Dibrugarh', state: 'Assam', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Tea capital of India on the banks of the Brahmaputra River.', query: 'Dibrugarh tea gardens India' },
  { id: 'c-as-3', name: 'Jorhat', state: 'Assam', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Heritage tea estates, research centers, and Majuli river island gateway.', query: 'Jorhat tea estate India' },
  { id: 'c-as-4', name: 'Tezpur', state: 'Assam', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Scenic parks, ancient ruins, and mythological love stories.', query: 'Tezpur parks ruins India' },
  { id: 'c-as-5', name: 'Sivasagar', state: 'Assam', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Historical monuments, temples, and palaces of the Ahom kingdom.', query: 'Sivasagar Ahom temple India' },
  { id: 'c-as-6', name: 'Silchar', state: 'Assam', country: 'India', category: 'City', popularity: 'Medium', description: 'Tea estates, paper factories, and Barak river valley landscapes.', query: 'Silchar tea valley India' },
  { id: 'c-as-7', name: 'Kaziranga', state: 'Assam', country: 'India', category: 'Wildlife', popularity: 'High', description: 'Grasslands home to the world-famous one-horned rhinoceros.', query: 'Kaziranga rhinoceros rhino India' },

  // Bihar
  { id: 'c-bi-1', name: 'Patna', state: 'Bihar', country: 'India', category: 'City', popularity: 'High', description: 'Ancient city of Pataliputra on the banks of the Ganges.', query: 'Patna city Ganga river India' },
  { id: 'c-bi-2', name: 'Gaya', state: 'Bihar', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Sacred town for ancestral Pinda Daan rituals and temples.', query: 'Gaya temple ghat India' },
  { id: 'c-bi-3', name: 'Bodh Gaya', state: 'Bihar', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Mahabodhi Temple where Lord Buddha attained enlightenment.', query: 'Bodh Gaya Mahabodhi Temple India' },
  { id: 'c-bi-4', name: 'Rajgir', state: 'Bihar', country: 'India', category: 'Heritage', popularity: 'High', description: 'Hot springs, ropeway, Gridhra-kuta hill, and peace pagoda.', query: 'Rajgir peace pagoda India' },
  { id: 'c-bi-5', name: 'Nalanda', state: 'Bihar', country: 'India', category: 'Heritage', popularity: 'High', description: 'Ancient ruins of the world-famous Nalanda University.', query: 'Nalanda university ruins India' },
  { id: 'c-bi-6', name: 'Muzaffarpur', state: 'Bihar', country: 'India', category: 'Food', popularity: 'Medium', description: 'Famous Shahi Lychee gardens and bustling local markets.', query: 'Muzaffarpur markets India' },
  { id: 'c-bi-7', name: 'Bhagalpur', state: 'Bihar', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Historic silk manufacturing city and dolphin sanctuaries.', query: 'Bhagalpur silk city India' },

  // Chhattisgarh
  { id: 'c-ch-1', name: 'Raipur', state: 'Chhattisgarh', country: 'India', category: 'City', popularity: 'Medium', description: 'Capital city with steel factories, temples, and lakes.', query: 'Raipur Chhattisgarh city India' },
  { id: 'c-ch-2', name: 'Bilaspur', state: 'Chhattisgarh', country: 'India', category: 'City', popularity: 'Medium', description: 'Famous Kosa silk weaving hub and nearby historical ruins.', query: 'Bilaspur ruins India' },
  { id: 'c-ch-3', name: 'Jagdalpur', state: 'Chhattisgarh', country: 'India', category: 'Nature', popularity: 'High', description: 'Chitrakote waterfalls and rich tribal craft markets.', query: 'Chitrakote waterfalls Jagdalpur India' },
  { id: 'c-ch-4', name: 'Durg', state: 'Chhattisgarh', country: 'India', category: 'City', popularity: 'Medium', description: 'Industrial city near the Bhilai steel plant layout.', query: 'Durg city India' },
  { id: 'c-ch-5', name: 'Bhilai', state: 'Chhattisgarh', country: 'India', category: 'City', popularity: 'Medium', description: 'Well-planned steel township with gardens and zoo parks.', query: 'Bhilai steel plant park India' },
  { id: 'c-ch-6', name: 'Ambikapur', state: 'Chhattisgarh', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Scenic hills, hot springs, and temple caves.', query: 'Ambikapur hills forest India' },

  // Goa
  { id: 'c-go-1', name: 'Panaji', state: 'Goa', country: 'India', category: 'Culture', popularity: 'High', description: 'Capital city with colorful Portuguese Latin quarters.', query: 'Panaji Fontainhas Goa India' },
  { id: 'c-go-2', name: 'Vasco da Gama', state: 'Goa', country: 'India', category: 'City', popularity: 'Medium', description: 'Seaport city with beaches and naval aviation museum.', query: 'Vasco da Gama port beach India' },
  { id: 'c-go-3', name: 'Margao', state: 'Goa', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Cultural capital of Goa with old colonial mansions.', query: 'Margao old house Goa India' },
  { id: 'c-go-4', name: 'Mapusa', state: 'Goa', country: 'India', category: 'Food', popularity: 'Medium', description: 'Famous traditional Friday markets and spices.', query: 'Mapusa market Goa India' },
  { id: 'c-go-5', name: 'Calangute', state: 'Goa', country: 'India', category: 'Beach', popularity: 'High', description: 'Queen of beaches with active water sports and clubs.', query: 'Calangute beach water sports Goa' },
  { id: 'c-go-6', name: 'Anjuna', state: 'Goa', country: 'India', category: 'Beach', popularity: 'High', description: 'Rocky cliffs, flea markets, and seaside party shacks.', query: 'Anjuna beach cliff Goa India' },
  { id: 'c-go-7', name: 'Candolim', state: 'Goa', country: 'India', category: 'Beach', popularity: 'High', description: 'Long sandy beaches, water activities, and Aguada Fort.', query: 'Candolim beach Aguada fort Goa' },
  { id: 'c-go-8', name: 'Baga', state: 'Goa', country: 'India', category: 'Beach', popularity: 'High', description: 'Bustling night clubs, seafood shacks, and water sports.', query: 'Baga beach shacks Goa India' },

  // Gujarat
  { id: 'c-gu-1', name: 'Ahmedabad', state: 'Gujarat', country: 'India', category: 'Heritage', popularity: 'High', description: 'Gandhi Ashram, heritage stepwells, and street food corridors.', query: 'Ahmedabad India Adalaj Stepwell Sabarmati Ashram' },
  { id: 'c-gu-2', name: 'Vadodara', state: 'Gujarat', country: 'India', category: 'Heritage', popularity: 'High', description: 'Grand Laxmi Vilas Palace and royal museums.', query: 'Vadodara Laxmi Vilas Palace India' },
  { id: 'c-gu-3', name: 'Surat', state: 'Gujarat', country: 'India', category: 'City', popularity: 'Medium', description: 'Diamond polishing markets, textile hubs, and beaches.', query: 'Surat Dumas Beach Castle India' },
  { id: 'c-gu-4', name: 'Rajkot', state: 'Gujarat', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Mahatma Gandhi home museum and local handicrafts.', query: 'Rajkot Gujarat India' },
  { id: 'c-gu-5', name: 'Gandhinagar', state: 'Gujarat', country: 'India', category: 'City', popularity: 'Medium', description: 'Green capital city, Akshardham Temple, and parks.', query: 'Gandhinagar Akshardham Temple India' },
  { id: 'c-gu-6', name: 'Bhuj', state: 'Gujarat', country: 'India', category: 'Culture', popularity: 'High', description: 'Gateway to the Great Rann of Kutch white salt deserts.', query: 'Bhuj Rann of Kutch India' },
  { id: 'c-gu-7', name: 'Dwarka', state: 'Gujarat', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Ancient coastal temple of Dwarkadhish by the sea.', query: 'Dwarka temple coast India' },
  { id: 'c-gu-8', name: 'Somnath', state: 'Gujarat', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Historic Somnath temple overlooking the Arabian Sea.', query: 'Somnath temple Gujarat India' },
  { id: 'c-gu-9', name: 'Junagadh', state: 'Gujarat', country: 'India', category: 'Heritage', popularity: 'High', description: 'Girnar hills, Uparkot Fort, and historic rock edicts.', query: 'Junagadh Girnar hills fort India' },
  { id: 'c-gu-10', name: 'Jamnagar', state: 'Gujarat', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Marine National Park, bird sanctuaries, and lakes.', query: 'Jamnagar lake palace India' },
  { id: 'c-gu-11', name: 'Porbandar', state: 'Gujarat', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Coastal birthplace of Mahatma Gandhi and temples.', query: 'Porbandar coast temple India' },
  { id: 'c-gu-12', name: 'Saputara', state: 'Gujarat', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Only hill station in Gujarat with lakes and gardens.', query: 'Saputara hill station lake India' },
  { id: 'c-gu-13', name: 'Patan', state: 'Gujarat', country: 'India', category: 'Heritage', popularity: 'High', description: 'Famous Rani Ki Vav stepwell and Patola silk weavers.', query: 'Patan Rani Ki Vav stepwell India' },
  { id: 'c-gu-14', name: 'Modhera', state: 'Gujarat', country: 'India', category: 'Heritage', popularity: 'High', description: 'Historic Sun Temple and carved water tank.', query: 'Modhera Sun Temple tank India' },

  // Haryana
  { id: 'c-ha-1', name: 'Gurugram', state: 'Haryana', country: 'India', category: 'City', popularity: 'High', description: 'Cyber hub offices, luxury malls, and dining.', query: 'Gurugram cyber hub skyscrapers India' },
  { id: 'c-ha-2', name: 'Faridabad', state: 'Haryana', country: 'India', category: 'City', popularity: 'Medium', description: 'Industrial city famous for Surajkund handicraft fair.', query: 'Faridabad Surajkund lake India' },
  { id: 'c-ha-3', name: 'Panipat', state: 'Haryana', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'City of weavers and historic battlefield sites.', query: 'Panipat battle monument India' },
  { id: 'c-ha-4', name: 'Karnal', state: 'Haryana', country: 'India', category: 'City', popularity: 'Medium', description: 'Agricultural research city with Karnal lake.', query: 'Karnal lake park India' },
  { id: 'c-ha-5', name: 'Hisar', state: 'Haryana', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Historical fort ruins built by Firoz Shah Tughlaq.', query: 'Hisar fort ruins India' },
  { id: 'c-ha-6', name: 'Ambala', state: 'Haryana', country: 'India', category: 'City', popularity: 'Medium', description: 'Major cantonment town and wholesale cloth markets.', query: 'Ambala market city India' },
  { id: 'c-ha-7', name: 'Kurukshetra', state: 'Haryana', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Sacred land of Mahabharat battle and temples.', query: 'Kurukshetra lake temple India' },

  // Himachal Pradesh
  { id: 'c-hp-1', name: 'Shimla', state: 'Himachal Pradesh', country: 'India', category: 'Mountains', popularity: 'High', description: 'Capital hill station, pine-covered ridges, and mall road.', query: 'Shimla India Ridge Mall Road Himachal' },
  { id: 'c-hp-2', name: 'Manali', state: 'Himachal Pradesh', country: 'India', category: 'Mountains', popularity: 'High', description: 'Snow valleys, river rafting, and mountain passes.', query: 'Manali India Solang Valley snow mountains' },
  { id: 'c-hp-3', name: 'Dharamshala', state: 'Himachal Pradesh', country: 'India', category: 'Mountains', popularity: 'High', description: 'Scenic pine forests, tea gardens, and mountain views.', query: 'Dharamshala mountains India' },
  { id: 'c-hp-4', name: 'Dalhousie', state: 'Himachal Pradesh', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Pine-covered hills and Victorian-era colonial buildings.', query: 'Dalhousie hills forest India' },
  { id: 'c-hp-5', name: 'Kullu', state: 'Himachal Pradesh', country: 'India', category: 'Adventure', popularity: 'Medium', description: 'Scenic river valleys, apple orchards, and rafting.', query: 'Kullu valley river India' },
  { id: 'c-hp-6', name: 'Kasol', state: 'Himachal Pradesh', country: 'India', category: 'Adventure', popularity: 'High', description: 'Backpacker haven in Parvati Valley, pine hills, and cafes.', query: 'Kasol Parvati River India' },
  { id: 'c-hp-7', name: 'Kasauli', state: 'Himachal Pradesh', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Quiet colonial hill station with church walks.', query: 'Kasauli hills church India' },
  { id: 'c-hp-8', name: 'Chamba', state: 'Himachal Pradesh', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Ancient temples, miniature paintings, and river views.', query: 'Chamba temple mountains India' },
  { id: 'c-hp-9', name: 'Spiti', state: 'Himachal Pradesh', country: 'India', category: 'Adventure', popularity: 'High', description: 'Cold desert valley, ancient monasteries, and high passes.', query: 'Spiti Valley monasteries mountains India' },
  { id: 'c-hp-10', name: 'McLeod Ganj', state: 'Himachal Pradesh', country: 'India', category: 'Culture', popularity: 'High', description: 'Tibetan culture, Dalai Lama temple, and hiking trails.', query: 'McLeod Ganj Triund mountains India' },

  // Jharkhand
  { id: 'c-jh-1', name: 'Ranchi', state: 'Jharkhand', country: 'India', category: 'Nature', popularity: 'Medium', description: 'City of waterfalls, temples, and surrounding green hills.', query: 'Ranchi waterfall hills India' },
  { id: 'c-jh-2', name: 'Jamshedpur', state: 'Jharkhand', country: 'India', category: 'City', popularity: 'Medium', description: 'India\'s steel city, clean layout, and parks.', query: 'Jamshedpur park city India' },
  { id: 'c-jh-3', name: 'Dhanbad', state: 'Jharkhand', country: 'India', category: 'City', popularity: 'Medium', description: 'Coal capital of India with lakes and dams.', query: 'Dhanbad lake city India' },
  { id: 'c-jh-4', name: 'Deoghar', state: 'Jharkhand', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy Baidyanath Jyotirlinga temple site.', query: 'Deoghar Baidyanath temple India' },
  { id: 'c-jh-5', name: 'Bokaro', state: 'Jharkhand', country: 'India', category: 'City', popularity: 'Medium', description: 'Steel city with public parks and dams.', query: 'Bokaro park city India' },
  { id: 'c-jh-6', name: 'Hazaribagh', state: 'Jharkhand', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Scenic lakes, hills, and wildlife reserve forests.', query: 'Hazaribagh lake forest India' },

  // Karnataka
  { id: 'c-ka-1', name: 'Bengaluru', state: 'Karnataka', country: 'India', category: 'City', popularity: 'High', description: 'Modern technology capital, gardens, and microbreweries.', query: 'Bengaluru India Vidhana Soudha Palace' },
  { id: 'c-ka-2', name: 'Mysuru', state: 'Karnataka', country: 'India', category: 'Heritage', popularity: 'High', description: 'Grand Mysore Palace, sandalwood carvings, and royal history.', query: 'Mysore India Palace Chamundi Hills' },
  { id: 'c-ka-3', name: 'Mangaluru', state: 'Karnataka', country: 'India', category: 'Food', popularity: 'Medium', description: 'Seaport city with beaches, temples, and coastal seafood.', query: 'Mangalore coast beach India' },
  { id: 'c-ka-4', name: 'Hubballi', state: 'Karnataka', country: 'India', category: 'City', popularity: 'Medium', description: 'Commercial trading center and Unkal lake gardens.', query: 'Hubli lake garden India' },
  { id: 'c-ka-5', name: 'Dharwad', state: 'Karnataka', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Famous Dharwad pedha sweets and classical music heritage.', query: 'Dharwad sweet town India' },
  { id: 'c-ka-6', name: 'Hampi', state: 'Karnataka', country: 'India', category: 'Heritage', popularity: 'High', description: 'Ancient boulder ruins of the Vijayanagara empire.', query: 'Hampi India ancient ruins' },
  { id: 'c-ka-7', name: 'Coorg', state: 'Karnataka', country: 'India', category: 'Nature', popularity: 'High', description: 'Coffee plantations, misty green hills, and Abbey Falls.', query: 'Coorg coffee hills India' },
  { id: 'c-ka-8', name: 'Chikmagalur', state: 'Karnataka', country: 'India', category: 'Nature', popularity: 'High', description: 'Lush coffee estates, Mullayanagiri peaks, and waterfalls.', query: 'Chikmagalur coffee estate India' },
  { id: 'c-ka-9', name: 'Udupi', state: 'Karnataka', country: 'India', category: 'Food', popularity: 'High', description: 'Krishna temple, beaches, and world-famous vegetarian food.', query: 'Udupi beach temple India' },
  { id: 'c-ka-10', name: 'Gokarna', state: 'Karnataka', country: 'India', category: 'Beach', popularity: 'High', description: 'Untouched beaches, Mahabaleshwar temple, and laid-back shacks.', query: 'Gokarna beach cliff India' },
  { id: 'c-ka-11', name: 'Belagavi', state: 'Karnataka', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Historical fort, waterfalls, and scenic hills.', query: 'Belgaum fort hills India' },
  { id: 'c-ka-12', name: 'Shivamogga', state: 'Karnataka', country: 'India', category: 'Nature', popularity: 'High', description: 'Jog Falls, rain forests, and wildlife parks.', query: 'Jog Falls Shivamogga India' },

  // Kerala
  { id: 'c-ke-1', name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', category: 'City', popularity: 'High', description: 'Padmanabhaswamy temple, beaches, and museums.', query: 'Trivandrum temple museum India' },
  { id: 'c-ke-2', name: 'Kochi', state: 'Kerala', country: 'India', category: 'Culture', popularity: 'High', description: 'Chinese fishing nets, spice markets, and backwater views.', query: 'Kochi India Kerala backwaters' },
  { id: 'c-ke-3', name: 'Kozhikode', state: 'Kerala', country: 'India', category: 'Food', popularity: 'Medium', description: 'Historic spice port, malabar halwa, and beaches.', query: 'Kozhikode beach Kerala India' },
  { id: 'c-ke-4', name: 'Thrissur', state: 'Kerala', country: 'India', category: 'Culture', popularity: 'High', description: 'Cultural capital, Vadakkunnathan temple, and Pooram festival.', query: 'Thrissur pooram festival India' },
  { id: 'c-ke-5', name: 'Alappuzha', state: 'Kerala', country: 'India', category: 'Nature', popularity: 'High', description: 'Houseboat cruises along scenic backwater channels.', query: 'Alleppey houseboat backwaters India' },
  { id: 'c-ke-6', name: 'Munnar', state: 'Kerala', country: 'India', category: 'Mountains', popularity: 'High', description: 'Misty tea gardens, valleys, and waterfalls.', query: 'Munnar India tea plantations' },
  { id: 'c-ke-7', name: 'Varkala', state: 'Kerala', country: 'India', category: 'Beach', popularity: 'High', description: 'Red cliffs overlooking the Arabian Sea beach.', query: 'Varkala beach cliff India' },
  { id: 'c-ke-8', name: 'Wayanad', state: 'Kerala', country: 'India', category: 'Nature', popularity: 'High', description: 'Spice plantations, caves, and wildlife forests.', query: 'Wayanad hills forest India' },
  { id: 'c-ke-9', name: 'Kollam', state: 'Kerala', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Historic trading town, Ashtamudi lake houseboats.', query: 'Kollam lake boat India' },
  { id: 'c-ke-10', name: 'Kumarakom', state: 'Kerala', country: 'India', category: 'Nature', popularity: 'High', description: 'Luxury backwater lake resorts and bird sanctuaries.', query: 'Kumarakom lake resorts India' },
  { id: 'c-ke-11', name: 'Thekkady', state: 'Kerala', country: 'India', category: 'Wildlife', popularity: 'High', description: 'Periyar national park elephant safaris and lakes.', query: 'Periyar lake elephant India' },
  { id: 'c-ke-12', name: 'Kannur', state: 'Kerala', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Traditional Theyyam dances, beaches, and handloom mills.', query: 'Kannur Theyyam dance India' },

  // Madhya Pradesh
  { id: 'c-mp-1', name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', category: 'Nature', popularity: 'High', description: 'City of lakes, massive mosques, and cave paintings.', query: 'Bhopal lake mosque India' },
  { id: 'c-mp-2', name: 'Indore', state: 'Madhya Pradesh', country: 'India', category: 'Food', popularity: 'High', description: 'Cleanest city, street food at Chappan Bhog.', query: 'Indore food palace India' },
  { id: 'c-mp-3', name: 'Gwalior', state: 'Madhya Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Hilltop Gwalior Fort, royal Scindia palace.', query: 'Gwalior Fort palace India' },
  { id: 'c-mp-4', name: 'Jabalpur', state: 'Madhya Pradesh', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Marble rocks canyon on Narmada River and waterfalls.', query: 'Jabalpur marble rocks waterfall India' },
  { id: 'c-mp-5', name: 'Ujjain', state: 'Madhya Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy Mahakaleshwar temple and Shipra River ghats.', query: 'Ujjain temple ghat India' },
  { id: 'c-mp-6', name: 'Khajuraho', state: 'Madhya Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Medieval temples with detailed sandstone carvings.', query: 'Khajuraho temples carvings India' },
  { id: 'c-mp-7', name: 'Orchha', state: 'Madhya Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Chaturbhuj Temple, palaces on Betwa River.', query: 'Orchha temple palace India' },
  { id: 'c-mp-8', name: 'Sanchi', state: 'Madhya Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Ancient Sanchi Stupa built by Emperor Ashoka.', query: 'Sanchi Stupa India' },
  { id: 'c-mp-9', name: 'Pachmarhi', state: 'Madhya Pradesh', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Hill station, waterfalls, and cave temples.', query: 'Pachmarhi hills forest India' },
  { id: 'c-mp-10', name: 'Mandu', state: 'Madhya Pradesh', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Ancient fortress city, Jahaz Mahal palace.', query: 'Mandu Jahaz Mahal India' },

  // Maharashtra
  { id: 'c-mh-1', name: 'Mumbai', state: 'Maharashtra', country: 'India', category: 'City', popularity: 'High', description: 'Gateway of India, Marine Drive, and Bollywood.', query: 'Mumbai India Gateway of India Marine Drive' },
  { id: 'c-mh-2', name: 'Pune', state: 'Maharashtra', country: 'India', category: 'Culture', popularity: 'High', description: 'Shaniwar Wada, Sinhagad Fort, and rich history.', query: 'Pune India Shaniwar Wada Sinhagad Fort' },
  { id: 'c-mh-3', name: 'Nashik', state: 'Maharashtra', country: 'India', category: 'Food', popularity: 'High', description: 'Wine capital with Sula vineyards and holy ghats.', query: 'Nashik India Panchavati Sula Vineyards' },
  { id: 'c-mh-4', name: 'Nagpur', state: 'Maharashtra', country: 'India', category: 'City', popularity: 'Medium', description: 'Orange city, lakes, and tiger reserve gateway.', query: 'Nagpur city lake India' },
  { id: 'c-mh-5', name: 'Aurangabad', state: 'Maharashtra', country: 'India', category: 'Heritage', popularity: 'High', description: 'Base for Ajanta and Ellora ancient caves.', query: 'Ellora caves Aurangabad India' },
  { id: 'c-mh-6', name: 'Kolhapur', state: 'Maharashtra', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Mahalakshmi temple, royal history, and local thalis.', query: 'Kolhapur temple palace India' },
  { id: 'c-mh-7', name: 'Lonavala', state: 'Maharashtra', country: 'India', category: 'Nature', popularity: 'High', description: 'Foggy green hills and waterfalls near Mumbai.', query: 'Lonavala hills rain India' },
  { id: 'c-mh-8', name: 'Mahabaleshwar', state: 'Maharashtra', country: 'India', category: 'Nature', popularity: 'High', description: 'Strawberry farms, evergreen forests, and view cliffs.', query: 'Mahabaleshwar hills India' },
  { id: 'c-mh-9', name: 'Alibaug', state: 'Maharashtra', country: 'India', category: 'Beach', popularity: 'Medium', description: 'Black sand beaches and sea fort getaways.', query: 'Alibaug beach sea fort India' },
  { id: 'c-mh-10', name: 'Shirdi', state: 'Maharashtra', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Sacred temple shrine of Sai Baba.', query: 'Shirdi Sai Baba temple India' },
  { id: 'c-mh-11', name: 'Ratnagiri', state: 'Maharashtra', country: 'India', category: 'Food', popularity: 'Medium', description: 'Alphanso mangoes, coastal beaches, and forts.', query: 'Ratnagiri beach fort India' },
  { id: 'c-mh-12', name: 'Amravati', state: 'Maharashtra', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Melghat tiger reserve, temples, and hills.', query: 'Amravati hills forest India' },

  // Manipur
  { id: 'c-mn-1', name: 'Imphal', state: 'Manipur', country: 'India', category: 'City', popularity: 'Medium', description: 'Kangla Fort, floating Loktak lake islands.', query: 'Imphal Loktak lake Manipur India' },
  { id: 'c-mn-2', name: 'Ukhrul', state: 'Manipur', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Scenic green hills, Shirui lily flowers.', query: 'Ukhrul hills Manipur India' },
  { id: 'c-mn-3', name: 'Churachandpur', state: 'Manipur', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Tribal culture, handlooms, and valleys.', query: 'Churachandpur hills Manipur India' },

  // Meghalaya
  { id: 'c-me-1', name: 'Shillong', state: 'Meghalaya', country: 'India', category: 'Mountains', popularity: 'High', description: 'Scotland of the East, pine hills, and waterfalls.', query: 'Shillong Meghalaya hills India' },
  { id: 'c-me-2', name: 'Cherrapunji', state: 'Meghalaya', country: 'India', category: 'Nature', popularity: 'High', description: 'Double decker living root bridges and rain cliffs.', query: 'Cherrapunji living root bridge India' },
  { id: 'c-me-3', name: 'Mawsynram', state: 'Meghalaya', country: 'India', category: 'Nature', popularity: 'High', description: 'Wettest place on earth, waterfalls, and green caves.', query: 'Mawsynram rain caves India' },
  { id: 'c-me-4', name: 'Dawki', state: 'Meghalaya', country: 'India', category: 'Adventure', popularity: 'High', description: 'Crystal clear water boating on Umngot River.', query: 'Dawki river boat India' },
  { id: 'c-me-5', name: 'Tura', state: 'Meghalaya', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Nokrek national park, scenic hills, and waterfalls.', query: 'Tura hills waterfall India' },

  // Mizoram
  { id: 'c-mz-1', name: 'Aizawl', state: 'Mizoram', country: 'India', category: 'City', popularity: 'Medium', description: 'High ridge capital city, local bamboo crafts.', query: 'Aizawl Mizoram hills India' },
  { id: 'c-mz-2', name: 'Lunglei', state: 'Mizoram', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Quiet hills, stone bridge, and forests.', query: 'Lunglei hills forest India' },
  { id: 'c-mz-3', name: 'Champhai', state: 'Mizoram', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Scenic rice fields, Indo-Myanmar border hills.', query: 'Champhai hills Mizoram India' },
  { id: 'c-mz-4', name: 'Serchhip', state: 'Mizoram', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Highest waterfalls, quiet village valleys.', query: 'Serchhip waterfall Mizoram India' },

  // Nagaland
  { id: 'c-na-1', name: 'Kohima', state: 'Nagaland', country: 'India', category: 'Culture', popularity: 'High', description: 'WWII cemetery, Hornbill festival hills.', query: 'Kohima Nagaland Hornbill India' },
  { id: 'c-na-2', name: 'Dimapur', state: 'Nagaland', country: 'India', category: 'City', popularity: 'Medium', description: 'Commercial hub, ancient ruins, and markets.', query: 'Dimapur Nagaland ruins India' },
  { id: 'c-na-3', name: 'Mokokchung', state: 'Nagaland', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Traditional Ao Naga tribal villages and hills.', query: 'Mokokchung Nagaland village India' },
  { id: 'c-na-4', name: 'Mon', state: 'Nagaland', country: 'India', category: 'Culture', popularity: 'High', description: 'Konyak tribal tattoo culture and village hills.', query: 'Mon Nagaland Konyak India' },

  // Odisha
  { id: 'c-od-1', name: 'Bhubaneswar', state: 'Odisha', country: 'India', category: 'Heritage', popularity: 'High', description: 'Temple city with historic sandstone carvings.', query: 'Bhubaneswar temples India' },
  { id: 'c-od-2', name: 'Cuttack', state: 'Odisha', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Silver filigree work and Mahanadi delta views.', query: 'Cuttack filigree city India' },
  { id: 'c-od-3', name: 'Puri', state: 'Odisha', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Jagannath Temple, chariot festival, and beaches.', query: 'Puri Jagannath temple beach India' },
  { id: 'c-od-4', name: 'Konark', state: 'Odisha', country: 'India', category: 'Heritage', popularity: 'High', description: 'Famous Sun Temple stone chariot ruins.', query: 'Konark Sun Temple India' },
  { id: 'c-od-5', name: 'Rourkela', state: 'Odisha', country: 'India', category: 'City', popularity: 'Medium', description: 'Steel city, temple hills, and park gardens.', query: 'Rourkela steel city India' },
  { id: 'c-od-6', name: 'Sambalpur', state: 'Odisha', country: 'India', category: 'Culture', popularity: 'Medium', description: 'Hirakud dam, handloom Sambalpuri sarees.', query: 'Sambalpur handloom dam India' },
  { id: 'c-od-7', name: 'Gopalpur', state: 'Odisha', country: 'India', category: 'Beach', popularity: 'Medium', description: 'Quiet golden sand beaches, old lighthouses.', query: 'Gopalpur beach Odisha India' },
  { id: 'c-od-8', name: 'Chilika', state: 'Odisha', country: 'India', category: 'Wildlife', popularity: 'High', description: 'Brackish lagoon, boat cruises, dolphin spotting.', query: 'Chilika lake dolphin India' },

  // Punjab
  { id: 'c-pu-1', name: 'Amritsar', state: 'Punjab', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Golden Temple, Jallianwala Bagh, border parade.', query: 'Amritsar India Golden Temple' },
  { id: 'c-pu-2', name: 'Ludhiana', state: 'Punjab', country: 'India', category: 'City', popularity: 'Medium', description: 'Hosiery factories, markets, and food streets.', query: 'Ludhiana city Punjab India' },
  { id: 'c-pu-3', name: 'Jalandhar', state: 'Punjab', country: 'India', category: 'City', popularity: 'Medium', description: 'Sports goods manufacturing, historic temples.', query: 'Jalandhar city Punjab India' },
  { id: 'c-pu-4', name: 'Patiala', state: 'Punjab', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Royal forts, palaces, and Punjabi culture.', query: 'Patiala palace fort India' },
  { id: 'c-pu-5', name: 'Bathinda', state: 'Punjab', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Ancient Qila Mubarak fort ruins.', query: 'Bathinda fort ruins India' },
  { id: 'c-pu-6', name: 'Pathankot', state: 'Punjab', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Foothill gateway to Himachal, rivers, dams.', query: 'Pathankot river hills India' },
  { id: 'c-pu-7', name: 'Anandpur Sahib', state: 'Punjab', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy Khalsa birthplace, Virasat-e-Khalsa museum.', query: 'Anandpur Sahib museum India' },

  // Rajasthan
  { id: 'c-rj-1', name: 'Jaipur', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'High', description: 'Hawa Mahal, Amber Fort, and royal markets.', query: 'Jaipur India Hawa Mahal Rajasthan' },
  { id: 'c-rj-2', name: 'Udaipur', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'High', description: 'City Palace, Lake Pichola boating, and hills.', query: 'Udaipur India City Palace Lake Pichola' },
  { id: 'c-rj-3', name: 'Jodhpur', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'High', description: 'Mehrangarh Fort, blue city houses, and markets.', query: 'Jodhpur India Mehrangarh Fort Blue City' },
  { id: 'c-rj-4', name: 'Jaisalmer', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'High', description: 'Golden Fort, desert sand dunes, and safaris.', query: 'Jaisalmer India Golden Fort Rajasthan' },
  { id: 'c-rj-5', name: 'Ajmer', state: 'Rajasthan', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy Sharif Dargah, Ana Sagar Lake views.', query: 'Ajmer Sharif Dargah India' },
  { id: 'c-rj-6', name: 'Pushkar', state: 'Rajasthan', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy Brahma temple, Pushkar lake, camel fair.', query: 'Pushkar India camel lake' },
  { id: 'c-rj-7', name: 'Bikaner', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Junagarh Fort, desert camel breeding farms.', query: 'Bikaner Junagarh Fort India' },
  { id: 'c-rj-8', name: 'Mount Abu', state: 'Rajasthan', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Nakki lake boating, Dilwara temples, hills.', query: 'Mount Abu Dilwara Temple India' },
  { id: 'c-rj-9', name: 'Kota', state: 'Rajasthan', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Chambal river gardens, canyon views.', query: 'Kota Chambal river India' },
  { id: 'c-rj-10', name: 'Alwar', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Bhangarh haunted fort, Sariska tiger reserve.', query: 'Alwar fort palace India' },
  { id: 'c-rj-11', name: 'Bharatpur', state: 'Rajasthan', country: 'India', category: 'Wildlife', popularity: 'High', description: 'Keoladeo national park bird sanctuary.', query: 'Bharatpur bird sanctuary India' },
  { id: 'c-rj-12', name: 'Chittorgarh', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'High', description: 'Massive Chittor Fort of Mewar history.', query: 'Chittorgarh Fort Rajasthan India' },
  { id: 'c-rj-13', name: 'Bundi', state: 'Rajasthan', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Stepwells, palaces, and miniature paintings.', query: 'Bundi stepwells palace India' },
  { id: 'c-rj-14', name: 'Ranthambore', state: 'Rajasthan', country: 'India', category: 'Wildlife', popularity: 'High', description: 'Tiger safari, hilltop Ranthambore fort ruins.', query: 'Ranthambore tiger safari India' },

  // Sikkim
  { id: 'c-si-1', name: 'Gangtok', state: 'Sikkim', country: 'India', category: 'Mountains', popularity: 'High', description: 'Capital city, monasteries, Himalayan views.', query: 'Gangtok mountains Sikkim India' },
  { id: 'c-si-2', name: 'Pelling', state: 'Sikkim', country: 'India', category: 'Mountains', popularity: 'High', description: 'Monasteries, skywalk, Kanchenjunga peaks.', query: 'Pelling Sikkim Kanchenjunga India' },
  { id: 'c-si-3', name: 'Namchi', state: 'Sikkim', country: 'India', category: 'Spiritual', popularity: 'Medium', description: 'Giant Shiva statue, monasteries, and gardens.', query: 'Namchi Shiva statue Sikkim' },
  { id: 'c-si-4', name: 'Lachung', state: 'Sikkim', country: 'India', category: 'Mountains', popularity: 'High', description: 'Yumthang flower valley, snow peaks.', query: 'Lachung Sikkim snow mountains' },
  { id: 'c-si-5', name: 'Lachen', state: 'Sikkim', country: 'India', category: 'Mountains', popularity: 'High', description: 'Gurudongmar high altitude lake gateway.', query: 'Lachen Gurudongmar lake Sikkim' },
  { id: 'c-si-6', name: 'Ravangla', state: 'Sikkim', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Buddha Park with massive sitting Buddha statue.', query: 'Ravangla Buddha Park Sikkim' },

  // Tamil Nadu
  { id: 'c-tn-1', name: 'Chennai', state: 'Tamil Nadu', country: 'India', category: 'City', popularity: 'High', description: 'Marina Beach, Dravidian temples, classical art.', query: 'Chennai India Kapaleeshwarar Temple Marina Beach' },
  { id: 'c-tn-2', name: 'Coimbatore', state: 'Tamil Nadu', country: 'India', category: 'City', popularity: 'Medium', description: 'Adiyogi Shiva bust, textile mills, hills.', query: 'Adiyogi Coimbatore Shiva India' },
  { id: 'c-tn-3', name: 'Madurai', state: 'Tamil Nadu', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Historic Meenakshi Temple, local food.', query: 'Madurai Meenakshi temple India' },
  { id: 'c-tn-4', name: 'Ooty', state: 'Tamil Nadu', country: 'India', category: 'Mountains', popularity: 'High', description: 'Tea gardens, lake boating, Nilgiri train.', query: 'Ooty hills toy train India' },
  { id: 'c-tn-5', name: 'Kodaikanal', state: 'Tamil Nadu', country: 'India', category: 'Mountains', popularity: 'High', description: 'Pine forests, lakes, and cold misty cliffs.', query: 'Kodaikanal lake hills India' },
  { id: 'c-tn-6', name: 'Thanjavur', state: 'Tamil Nadu', country: 'India', category: 'Heritage', popularity: 'High', description: 'Chola-era Brihadisvara Temple, paintings.', query: 'Thanjavur Brihadisvara Temple India' },
  { id: 'c-tn-7', name: 'Tiruchirappalli', state: 'Tamil Nadu', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Rock Fort temple, Srirangam island temple.', query: 'Trichy Rock Fort temple India' },
  { id: 'c-tn-8', name: 'Rameswaram', state: 'Tamil Nadu', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Pamban bridge, holy bathing pools, temples.', query: 'Rameswaram bridge temple India' },
  { id: 'c-tn-9', name: 'Kanyakumari', state: 'Tamil Nadu', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Southernmost tip, Vivekananda rock memorial.', query: 'Kanyakumari rock memorial India' },
  { id: 'c-tn-10', name: 'Mahabalipuram', state: 'Tamil Nadu', country: 'India', category: 'Heritage', popularity: 'High', description: 'Rock-cut temples, stone reliefs by the beach.', query: 'Mahabalipuram Shore Temple India' },
  { id: 'c-tn-11', name: 'Pondicherry', state: 'Tamil Nadu', country: 'India', category: 'Beach', popularity: 'High', description: 'French colony, Auroville, beach cafes.', query: 'Pondicherry French colony beach India' },
  { id: 'c-tn-12', name: 'Salem', state: 'Tamil Nadu', country: 'India', category: 'City', popularity: 'Medium', description: 'Mango orchards, steel factories, hill temples.', query: 'Salem hills temple India' },
  { id: 'c-tn-13', name: 'Vellore', state: 'Tamil Nadu', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Vellore Fort, Golden Temple at Sripuram.', query: 'Vellore Golden Temple India' },

  // Telangana
  { id: 'c-te-1', name: 'Hyderabad', state: 'Telangana', country: 'India', category: 'City', popularity: 'High', description: 'Charminar, Golconda Fort, local biryanis.', query: 'Hyderabad India Charminar' },
  { id: 'c-te-2', name: 'Warangal', state: 'Telangana', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Thousand Pillar Temple, stone fort gate ruins.', query: 'Warangal temple India' },
  { id: 'c-te-3', name: 'Nizamabad', state: 'Telangana', country: 'India', category: 'City', popularity: 'Medium', description: 'Temples, dams, and historic fort hillocks.', query: 'Nizamabad fort temple India' },
  { id: 'c-te-4', name: 'Karimnagar', state: 'Telangana', country: 'India', category: 'City', popularity: 'Medium', description: 'Silver filigree works, fort ruins, river views.', query: 'Karimnagar fort river India' },
  { id: 'c-te-5', name: 'Khammam', state: 'Telangana', country: 'India', category: 'City', popularity: 'Medium', description: 'Hilltop fort, temples, and local markets.', query: 'Khammam fort temple India' },

  // Tripura
  { id: 'c-tr-1', name: 'Agartala', state: 'Tripura', country: 'India', category: 'City', popularity: 'Medium', description: 'Ujjayanta Palace, lakes, and border parade.', query: 'Agartala Ujjayanta Palace India' },
  { id: 'c-tr-2', name: 'Udaipur', state: 'Tripura', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Historic Tripura Sundari temple, lakes.', query: 'Udaipur Tripura temple India' },
  { id: 'c-tr-3', name: 'Dharmanagar', state: 'Tripura', country: 'India', category: 'City', popularity: 'Medium', description: 'Ancient rock carvings nearby at Unakoti.', query: 'Dharmanagar Unakoti carvings India' },

  // Uttar Pradesh
  { id: 'c-up-1', name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', category: 'Culture', popularity: 'High', description: 'Bara Imambara, chikan embroidery, and kebabs.', query: 'Lucknow India Bara Imambara Rumi Darwaza' },
  { id: 'c-up-2', name: 'Agra', state: 'Uttar Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Home of the Taj Mahal, Agra Fort, Mughal art.', query: 'Agra India Taj Mahal' },
  { id: 'c-up-3', name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Sacred Ganges river ghats, aarti ceremonies.', query: 'Varanasi India Ganges Ghats' },
  { id: 'c-up-4', name: 'Prayagraj', state: 'Uttar Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Triveni Sangam river confluence, Kumbh site.', query: 'Prayagraj Sangam India' },
  { id: 'c-up-5', name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Leather factories, parks, and Ganges views.', query: 'Kanpur Ganga river India' },
  { id: 'c-up-6', name: 'Mathura', state: 'Uttar Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Birthplace of Lord Krishna on Yamuna river.', query: 'Mathura Krishna temple India' },
  { id: 'c-up-7', name: 'Vrinadavan', state: 'Uttar Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy temples, spiritual chants, and festivals.', query: 'Vrindavan temple festival India' },
  { id: 'c-up-8', name: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Birthplace of Lord Rama, grand Ram Mandir.', query: 'Ayodhya Ram Mandir India' },
  { id: 'c-up-9', name: 'Meerut', state: 'Uttar Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Historic 1857 mutiny sites, sports markets.', query: 'Meerut city monument India' },
  { id: 'c-up-10', name: 'Noida', state: 'Uttar Pradesh', country: 'India', category: 'City', popularity: 'High', description: 'Modern business IT parks, malls, skyscrapers.', query: 'Noida skyscrapers IT park India' },
  { id: 'c-up-11', name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Industrial gateway, city parks, local shopping.', query: 'Ghaziabad city park India' },
  { id: 'c-up-12', name: 'Gorakhpur', state: 'Uttar Pradesh', country: 'India', category: 'Spiritual', popularity: 'Medium', description: 'Gorakhnath temple, railway platform, lakes.', query: 'Gorakhnath temple Gorakhpur India' },
  { id: 'c-up-13', name: 'Jhansi', state: 'Uttar Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Fort of Rani Lakshmibai, historic battlements.', query: 'Jhansi Fort palace India' },
  { id: 'c-up-14', name: 'Bareilly', state: 'Uttar Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'Bamboo markets, local crafts, and temples.', query: 'Bareilly market city India' },
  { id: 'c-up-15', name: 'Aligarh', state: 'Uttar Pradesh', country: 'India', category: 'City', popularity: 'Medium', description: 'University town, historic fort, lock factories.', query: 'Aligarh university fort India' },
  { id: 'c-up-16', name: 'Sarnath', state: 'Uttar Pradesh', country: 'India', category: 'Heritage', popularity: 'High', description: 'Deer park where Buddha gave his first sermon.', query: 'Sarnath ancient ruins India' },

  // Uttarakhand
  { id: 'c-ut-1', name: 'Dehradun', state: 'Uttarakhand', country: 'India', category: 'Nature', popularity: 'High', description: 'Scenic valleys, Robber’s Cave, hill gateways.', query: 'Dehradun valley mountains India' },
  { id: 'c-ut-2', name: 'Rishikesh', state: 'Uttarakhand', country: 'India', category: 'Adventure', popularity: 'High', description: 'Ganges river rafting, yoga capital ashrams.', query: 'Rishikesh India Laxman Jhula Ganges' },
  { id: 'c-ut-3', name: 'Haridwar', state: 'Uttarakhand', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Sacred river ghat, evening oil lamp offerings.', query: 'Haridwar Ganga Aarti India' },
  { id: 'c-ut-4', name: 'Nainital', state: 'Uttarakhand', country: 'India', category: 'Nature', popularity: 'High', description: 'Naini lake boating, scenic viewpoint hills.', query: 'Nainital Lake hills India' },
  { id: 'c-ut-5', name: 'Mussoorie', state: 'Uttarakhand', country: 'India', category: 'Mountains', popularity: 'High', description: 'Kempty waterfalls, mall road walks, views.', query: 'Mussoorie hills India' },
  { id: 'c-ut-6', name: 'Almora', state: 'Uttarakhand', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Scenic ridge towns, temple walks, peak views.', query: 'Almora hills forest India' },
  { id: 'c-ut-7', name: 'Ranikhet', state: 'Uttarakhand', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Quiet military town, pine forests, golf courses.', query: 'Ranikhet hills pine forest India' },
  { id: 'c-ut-8', name: 'Auli', state: 'Uttarakhand', country: 'India', category: 'Adventure', popularity: 'High', description: 'Snowy ski slopes, pine trees, Himalayan views.', query: 'Auli skiing snow mountains India' },
  { id: 'c-ut-9', name: 'Badrinath', state: 'Uttarakhand', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Sacred temple in high Himalayan snow peaks.', query: 'Badrinath temple mountains India' },
  { id: 'c-ut-10', name: 'Kedarnath', state: 'Uttarakhand', country: 'India', category: 'Spiritual', popularity: 'High', description: 'Holy Shiva shrine amidst high glaciers.', query: 'Kedarnath temple mountains India' },
  { id: 'c-ut-11', name: 'Joshimath', state: 'Uttarakhand', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Mountain gateway, monasteries, ropeway base.', query: 'Joshimath mountains town India' },

  // West Bengal
  { id: 'c-wb-1', name: 'Kolkata', state: 'West Bengal', country: 'India', category: 'Culture', popularity: 'High', description: 'Victoria Memorial, sweet shops, tram lines.', query: 'Kolkata India Victoria Memorial' },
  { id: 'c-wb-2', name: 'Darjeeling', state: 'West Bengal', country: 'India', category: 'Mountains', popularity: 'High', description: 'Tea plantations, toy trains, mountain ranges.', query: 'Darjeeling India Toy Train Kanchenjunga' },
  { id: 'c-wb-3', name: 'Siliguri', state: 'West Bengal', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Wildlife parks, tea gardens, transport hub.', query: 'Siliguri tea gardens India' },
  { id: 'c-wb-4', name: 'Digha', state: 'West Bengal', country: 'India', category: 'Beach', popularity: 'Medium', description: 'Bay of Bengal beaches, seafood markets.', query: 'Digha beach Bengal India' },
  { id: 'c-wb-5', name: 'Kalimpong', state: 'West Bengal', country: 'India', category: 'Mountains', popularity: 'Medium', description: 'Monasteries, flower nurseries, hill views.', query: 'Kalimpong hills India' },
  { id: 'c-wb-6', name: 'Howrah', state: 'West Bengal', country: 'India', category: 'City', popularity: 'Medium', description: 'Historic Howrah station and massive bridge.', query: 'Howrah station bridge India' },
  { id: 'c-wb-7', name: 'Asansol', state: 'West Bengal', country: 'India', category: 'City', popularity: 'Medium', description: 'Industrial mining town, parks, and reservoirs.', query: 'Asansol park city India' },
  { id: 'c-wb-8', name: 'Sundarbans', state: 'West Bengal', country: 'India', category: 'Wildlife', popularity: 'High', description: 'Mangrove forests, home of Royal Bengal Tiger.', query: 'Sundarbans mangrove tiger India' },

  // UTs - Delhi
  { id: 'c-ut-del-1', name: 'New Delhi', state: 'Delhi', country: 'India', category: 'City', popularity: 'High', description: 'Rashtrapati Bhavan, India Gate, central capital.', query: 'New Delhi India Gate central' },
  { id: 'c-ut-del-2', name: 'Delhi', state: 'Delhi', country: 'India', category: 'City', popularity: 'High', description: 'Mughal monuments, historic streets, rich culture.', query: 'Delhi Red Fort India' },

  // UTs - Jammu & Kashmir
  { id: 'c-ut-jk-1', name: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', category: 'Mountains', popularity: 'High', description: 'Dal Lake houseboats, Mughal gardens, flowers.', query: 'Srinagar Dal Lake houseboats India' },
  { id: 'c-ut-jk-2', name: 'Jammu', state: 'Jammu & Kashmir', country: 'India', category: 'Spiritual', popularity: 'Medium', description: 'Temple city, gateway to Vaishno Devi hills.', query: 'Jammu temples fort India' },
  { id: 'c-ut-jk-3', name: 'Gulmarg', state: 'Jammu & Kashmir', country: 'India', category: 'Adventure', popularity: 'High', description: 'Gondola ride, snow skiing slopes in Himalayas.', query: 'Gulmarg skiing snow mountains India' },
  { id: 'c-ut-jk-4', name: 'Pahalgam', state: 'Jammu & Kashmir', country: 'India', category: 'Nature', popularity: 'High', description: 'Lidder river valley, pine forests, horse trails.', query: 'Pahalgam Lidder river pine India' },
  { id: 'c-ut-jk-5', name: 'Sonamarg', state: 'Jammu & Kashmir', country: 'India', category: 'Mountains', popularity: 'High', description: 'Meadow of gold, glaciers, and mountain trails.', query: 'Sonamarg glacier mountains India' },

  // UTs - Ladakh
  { id: 'c-ut-la-1', name: 'Leh', state: 'Ladakh', country: 'India', category: 'Adventure', popularity: 'High', description: 'Cold desert, Buddhist monasteries, high passes.', query: 'Leh Ladakh monasteries mountains India' },
  { id: 'c-ut-la-2', name: 'Kargil', state: 'Ladakh', country: 'India', category: 'Heritage', popularity: 'Medium', description: 'Historic war memorials, valleys, and rivers.', query: 'Kargil war memorial valley India' },
  { id: 'c-ut-la-3', name: 'Nubra Valley', state: 'Ladakh', country: 'India', category: 'Adventure', popularity: 'High', description: 'Double humped camel rides on sand dunes.', query: 'Nubra Valley camel sand dunes India' },
  { id: 'c-ut-la-4', name: 'Pangong', state: 'Ladakh', country: 'India', category: 'Nature', popularity: 'High', description: 'Breathtaking high altitude blue salt lake.', query: 'Pangong lake blue water Ladakh' },

  // UTs - Puducherry
  { id: 'c-ut-po-1', name: 'Puducherry', state: 'Puducherry', country: 'India', category: 'Beach', popularity: 'High', description: 'French Latin colony, cafes, and beaches.', query: 'Pondicherry French colony beach India' },
  { id: 'c-ut-po-2', name: 'Auroville', state: 'Puducherry', country: 'India', category: 'Culture', popularity: 'High', description: 'Universal township, Matrimandir golden dome.', query: 'Auroville Matrimandir golden dome' },

  // UTs - Chandigarh
  { id: 'c-ut-ch-1', name: 'Chandigarh', state: 'Chandigarh', country: 'India', category: 'City', popularity: 'High', description: 'Modern rock gardens and lake promenades.', query: 'Chandigarh rock garden Sukhna lake' },

  // UTs - Andaman & Nicobar
  { id: 'c-ut-an-1', name: 'Port Blair', state: 'Andaman & Nicobar', country: 'India', category: 'Heritage', popularity: 'High', description: 'Cellular Jail, ocean history, and island ports.', query: 'Port Blair Cellular Jail Andaman' },
  { id: 'c-ut-an-2', name: 'Havelock Island', state: 'Andaman & Nicobar', country: 'India', category: 'Beach', popularity: 'High', description: 'Radhanagar Beach, scuba diving, clear waters.', query: 'Havelock Island Radhanagar Beach Andaman' },
  { id: 'c-ut-an-3', name: 'Neil Island', state: 'Andaman & Nicobar', country: 'India', category: 'Beach', popularity: 'High', description: 'Quiet sandy shores, natural coral bridges.', query: 'Neil Island coral beach Andaman' },

  // UTs - Lakshadweep
  { id: 'c-ut-lk-1', name: 'Kavaratti', state: 'Lakshadweep', country: 'India', category: 'Beach', popularity: 'High', description: 'Turquoise lagoons, coconut groves, water sports.', query: 'Kavaratti lagoon Lakshadweep beach' },
  { id: 'c-ut-lk-2', name: 'Agatti', state: 'Lakshadweep', country: 'India', category: 'Beach', popularity: 'High', description: 'Runway by the ocean, coral reefs, beaches.', query: 'Agatti island beach Lakshadweep' },
  { id: 'c-ut-lk-3', name: 'Bangaram', state: 'Lakshadweep', country: 'India', category: 'Beach', popularity: 'High', description: 'Tear-drop island, resort diving, lagoons.', query: 'Bangaram island beach Lakshadweep' },

  // UTs - Dadra & Nagar Haveli and Daman & Diu
  { id: 'c-ut-dd-1', name: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu', country: 'India', category: 'Beach', popularity: 'Medium', description: 'Portuguese forts, black sand beaches, tax-free shops.', query: 'Daman beach fort India' },
  { id: 'c-ut-dd-2', name: 'Diu', state: 'Dadra and Nagar Haveli and Daman and Diu', country: 'India', category: 'Beach', popularity: 'Medium', description: 'Fortress walls by the ocean and shell museums.', query: 'Diu fort coast beach India' },
  { id: 'c-ut-dd-3', name: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', country: 'India', category: 'Nature', popularity: 'Medium', description: 'Tribal culture museum, gardens, and lakes.', query: 'Silvassa tribal garden lake India' }
];

const imageCache = new Map<string, string>();

const imageApiBase = 'http://localhost:4000/api/images/city';

export const normalizeDestination = (value: string | null | undefined): string =>
  (value || '').trim().toLocaleLowerCase();

export const getDestinationImage = (city: string | null | undefined, _country?: string | null | undefined): string => {
  const normCity = normalizeDestination(city);
  
  // Return cached result if available
  const cached = imageCache.get(normCity);
  if (cached) return cached;
  
  const matched = indianCitiesCatalog.find(c => normalizeDestination(c.name) === normCity);
  
  // Resolve search query: if matched, send specific Unsplash search string, otherwise use raw input
  const query = matched ? matched.query : (city?.trim() || '');
  const url = `${imageApiBase}?city=${encodeURIComponent(query)}`;
  
  // Cache the resolved URL so we don't recalculate or trigger re-renders
  if (normCity) {
    imageCache.set(normCity, url);
  }
  return url;
};

export const enrichDestination = (destination: Destination): Destination => {
  const normCity = normalizeDestination(destination.city);
  const matched = indianCitiesCatalog.find(c => normalizeDestination(c.name) === normCity);
  if (matched) {
    return {
      ...destination,
      description: matched.description,
      popularity: matched.popularity,
      imageUrl: getDestinationImage(destination.city, destination.country),
    };
  }
  return {
    ...destination,
    imageUrl: getDestinationImage(destination.city, destination.country),
  };
};
