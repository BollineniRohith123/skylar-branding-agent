import type { ProductCategory } from './types';
import {
  PlaneIcon,
  SeatIcon,
  BillboardIcon,
  BusIcon,
  MetroIcon,
  AirportTerminalIcon,
  TicketIcon,
  ShoppingMallIcon,
  LuggageIcon,
  LadderIcon,
  TrolleyIcon,
  MealTrayIcon,
  SkylinePanelIcon,
  RoadMedianIcon,
  CanopyIcon,
  UnipoleIcon,
  BridgeIcon
} from './components/icons';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: 'In-Flight Experience',
    products: [
      {
        id: 'aircraft-exterior',
        name: 'Aircraft Exterior',
        prompt: "Create an awe-inspiring, ultra-photorealistic medium-full shot of a brand new Airbus A350 on the tarmac at Mumbai's International Airport during the cinematic golden hour. The camera angle is low, shot on a 50mm lens, making the aircraft look heroic against a sky painted with warm orange and purple hues. The provided logo must be flawlessly integrated onto the glossy fuselage and tail fin, catching the warm sunlight perfectly. The wet tarmac from a recent shower should reflect the scene. The final image needs the authentic grain and texture of a high-end aviation photograph, completely avoiding a CGI or digitally rendered look.",
        icon: PlaneIcon,
      },
      {
        id: 'skyline-panel',
        name: 'Aircraft Skyline Panel',
        prompt: "Produce a photorealistic image from the perspective of a passenger inside a modern aircraft cabin, flying at high altitude. The view is angled up towards the 'skyline panel' above the windows, which features a continuous, elegant banner advertisement with the provided logo, designed to look like an integral part of the cabin. Soft, natural sunlight streams through the windows, illuminating the cabin with a calm, airy feel. The deep blue curvature of the Earth is visible outside. The final image must feel serene, premium, and absolutely real.",
        icon: SkylinePanelIcon,
      },
      {
        id: 'overhead-bin',
        name: 'Overhead Bin Ad',
        prompt: "Generate a wide-angle, photorealistic interior shot of a spacious, modern aircraft cabin (like an A321neo). The camera is low, looking up the aisle, showcasing multiple overhead luggage bins. The provided logo is crisply and repeatedly printed on the surface of the closed bins, creating a powerful branding effect. The cabin is bathed in cool, blue-toned LED mood lighting. The image must be perfectly symmetrical and clean, conveying a sense of order, modernity, and premium travel.",
        icon: LuggageIcon,
      },
      {
        id: 'seat-headrest',
        name: 'Seat Headrest Cover',
        prompt: "Create an intimate, ultra-realistic, close-up photograph of a seat in a business class cabin. The camera uses a macro lens with a very shallow depth of field, focusing intensely on the premium, textured fabric of the headrest cover. The provided logo is elegantly embroidered onto the cover, with the threads catching the soft, directional cabin light. The background melts away into a beautiful, soft bokeh. The final image must be tactile and luxurious, making the viewer feel they could reach out and touch the fabric. It must be indistinguishable from a real, high-end commercial photograph.",
        icon: SeatIcon,
      },
      {
        id: 'meal-tray',
        name: 'Aircraft Meal Tray Ad',
        prompt: "Create an elegant, ultra-realistic, top-down photograph of an airplane meal tray table in a business class setting. The tray table is deployed, and its entire surface is a high-quality advertisement featuring the provided logo. The shot is styled like a luxury lifestyle flat-lay. A hand with a premium watch is reaching for a glass of juice. The lighting is soft and directional, simulating the cabin's sophisticated lighting. The image must be aspirational, focusing on textures—the condensation on the glass, the fabric of the seat, the matte finish of the tray ad.",
        icon: MealTrayIcon,
      },
    ]
  },
  {
    name: 'Airport & Ground Services',
    products: [
      {
        id: 'terminal-ad',
        name: 'Airport Terminal Ad',
        prompt: "Create a serene, ultra-photorealistic image inside Bengaluru's acclaimed Terminal 2. The shot should capture the terminal’s unique 'garden' ambiance, with soft, natural light filtering through the bamboo-finished ceiling. The focal point is a sleek, vertical digital kiosk displaying an elegant advertisement with the provided logo. Use a shallow depth of field to create a soft, out-of-focus background of lush indoor plants and strolling passengers. The final image must evoke a feeling of calm, luxury, and modern, sustainable design.",
        icon: AirportTerminalIcon,
      },
      {
        id: 'boarding-pass',
        name: 'Boarding Pass Advertisement',
        prompt: "Create an ultra-realistic, professional photograph of a physical Indian airline boarding pass (Air India, IndiGo, SpiceJet, or Vistara) being held by human hands against a clean, modern airport background. The boarding pass should be positioned at a slight angle showing the back side prominently, with the uploaded logo professionally printed as a high-quality advertisement in the center. The hands should be well-manicured and positioned naturally, holding the boarding pass securely. Include authentic details like the barcode, airline branding on edges, paper texture, flight information, and Hindi/English text. The lighting should be bright airport lighting with soft shadows, creating a premium, professional atmosphere. The composition should emphasize the tangible, high-quality nature of the boarding pass advertisement, making it look like a real promotional partnership. The boarding pass must clearly show Indian airline branding with Indian airport codes (DEL, BOM, BLR, etc.).",
        icon: TicketIcon,
      },
      {
        id: 'step-ladder',
        name: 'Aircraft Step Ladder',
        prompt: "Craft a bright, photorealistic daytime photograph of passengers boarding an ATR 72 aircraft at a sunny regional Indian airport. The central focus is the mobile aircraft step ladder. A clean, prominent advertisement with the provided logo is perfectly placed on the side panel of the ladder. The lighting is the harsh, bright sun of midday, creating crisp, dark shadows on the tarmac. The atmosphere is one of bustling travel. The image must be sharp, clear, and perfectly composed, like a professional photograph from an airline’s marketing department.",
        icon: LadderIcon,
      },
      {
        id: 'baggage-cart',
        name: 'Baggage Cart',
        prompt: "Craft a crisp, clean, ultra-realistic photograph of a line of modern luggage trolleys at Hyderabad's international airport. The shot is a close-up, focusing on the front advertising panel of one trolley where the provided logo is displayed with perfect clarity. The lighting is the bright, even, slightly cool light of a modern airport terminal, reflecting off the gleaming metal of the cart and the polished floor. The background is softly blurred, showing the vast, airy architecture of the arrivals hall. The final image must look professional and pristine.",
        icon: TrolleyIcon,
      },
    ]
  },
  {
    name: 'Roadside & Outdoor',
    products: [
      {
        id: 'unipole-billboard',
        name: 'Highway Unipole',
        prompt: "Generate a hyper-realistic photograph of a colossal unipole billboard towering over the bustling Hyderabad Outer Ring Road. The shot is a dynamic, low-angle perspective captured with a 50mm lens during late afternoon. The sky is a brilliant, clear blue, typical of a sunny South Indian day. The provided logo on the billboard advertisement must be sharp and vibrant. The scene should include realistic details like the heat haze shimmering above the asphalt, the metallic gleam of passing cars, and long, crisp shadows. The final image must feel powerful and epic, like a shot from a luxury car commercial.",
        icon: BillboardIcon,
      },
      {
        id: 'led-billboard',
        name: 'Digital LED Billboard',
        prompt: "Produce a stunningly realistic, cinematic night photograph of a massive, curved LED billboard at a major intersection in Mumbai, just after a monsoon downpour. The shot, captured as if on a professional mirrorless camera with a fast prime lens, focuses on the intense, vibrant glow of the screen displaying an ad with the provided logo. The wet streets must have specular, mirror-like reflections of the billboard's light and the neon signs of the surrounding city. The atmosphere should be electric and moody. Ensure the image has realistic lens flare and a beautiful bokeh in the background, capturing the non-stop energy of Mumbai at night.",
        icon: BillboardIcon,
      },
      {
        id: 'road-median',
        name: 'Road Median Ad',
        prompt: 'Create a clean, ultra-realistic photograph of a straight, properly proportioned road median advertising sign on a busy Bengaluru street during golden hour. The sign should be perfectly vertical and appropriately sized - not too tall or tilted. The focus is on a single, well-lit advertising panel showcasing a crisp ad with the provided logo. The sign should have a modern, professional appearance with clean lines and proper proportions. The background shows a typical Indian urban street with soft, warm lighting from street lamps and passing vehicles. The composition should be straight-on, showing the sign clearly without any tilting or distortion. The image must convey professionalism and modern urban advertising, with the logo clearly visible and properly integrated into the sign design.',
        icon: RoadMedianIcon,
      },
      {
        id: 'unipole-media',
        name: 'Unipole Media',
        prompt: "Generate a stunning, ultra-realistic photograph of a modern unipole advertising structure on a busy Mumbai highway. The unipole should be a sleek, vertical advertising column with a digital screen or high-quality printed advertisement featuring the provided logo. The structure should be contemporary and well-designed, standing prominently beside the road. The shot should be taken during late afternoon with golden lighting, showing the unipole in sharp focus against a clear sky. Include realistic details like the metallic finish of the structure, proper proportions (not too tall or distorted), and professional installation. The background should show a typical Indian highway with passing vehicles and urban infrastructure. The image must convey modern, high-end outdoor advertising with the logo clearly visible and professionally integrated into the design.",
        icon: UnipoleIcon,
      },
      {
        id: 'facade-bridge',
        name: 'Facade/Bridge Media',
        prompt: "Create a dynamic, ultra-realistic photograph of a large advertising facade on a flyover or bridge structure in Delhi or Mumbai. The advertisement should be prominently displayed on the side of the bridge or flyover, covering a significant portion of the concrete structure. The provided logo should be featured as a major element in a professional, high-impact advertisement design. The shot should be taken from street level looking up at the bridge, showing the scale and prominence of the advertising. Include realistic details like the concrete texture of the bridge, proper lighting from street lamps and vehicle headlights, and the urban environment below. The advertisement should look like a real-world bridge advertising campaign with vivid colors, proper proportions, and professional installation. The overall composition should emphasize the massive scale and visibility of bridge advertising in Indian cities.",
        icon: BridgeIcon,
      },
    ]
  },
  {
    name: 'Public Transit',
    products: [
      {
        id: 'bus-wrap',
        name: 'Bus Branding',
        prompt: "Create a dynamic, ultra-realistic action shot of a modern electric city bus in Pune, fully wrapped in a vibrant advertisement featuring the provided logo. Use a panning technique with a slightly slow shutter speed to capture the bus in sharp focus while the background—a bustling street with shops and pedestrians—is rendered in an artistic motion blur. The lighting should be bright daylight, catching the glossy finish of the wrap. The image must feel authentic and energetic, capturing a fleeting moment of urban Indian life with professional photographic quality.",
        icon: BusIcon,
      },
      {
        id: 'metro-exterior',
        name: 'Metro Exterior Wrap',
        prompt: "Generate a dynamic, photorealistic shot of a sleek Delhi Metro train pulling into an elevated, modern station platform. The camera is at platform level, capturing a dramatic side-angle view of the train. A large, vibrant advertisement featuring the provided logo is wrapped around the train's exterior carriages. The afternoon sun glints off the train's metallic surface, creating realistic highlights. Blurred commuters in the background add a sense of motion and urban life. The final image must look like a high-end advertising photograph for a major brand campaign.",
        icon: MetroIcon,
      },
      {
        id: 'metro-ad',
        name: 'Metro Platform Ad',
        prompt: "Craft a sharp, atmospheric, ultra-realistic photograph of a glowing digital advertising panel on a pristine Hyderabad Metro platform. The shot is at human eye-level, showing the ad, which features the provided logo, with stunning clarity. The polished granite floor reflects the panel's light and the cool, ambient lighting of the station. In the background, the blurred shape of an arriving train adds depth and a sense of anticipation. The image should feel clean, modern, and sophisticated, perfectly capturing the experience of a commuter in a world-class Indian metro.",
        icon: MetroIcon,
      },
      {
        id: 'car-wrap',
        name: 'Car Wrap Advertisement',
        prompt: "Generate a realistic photograph of a modern car popular in India (such as Maruti Suzuki, Hyundai, or Tata) in side view, parked in an Indian urban setting (Indian city street, market area, or commercial district) with natural lighting. Apply the uploaded logo prominently on the car door as a large, professional advertisement wrap. The logo should be centered on the door panel, scaled appropriately to fit the door's dimensions while maintaining correct proportions and aspect ratio. The wrap should follow the natural contours and curves of the car door seamlessly. Surround the logo with complementary design elements, gradient backgrounds, or subtle product imagery that matches the brand's color scheme, similar to professional vehicle branding campaigns seen in Indian cities. Ensure the wrap does not cover windows, door handles, mirrors, or wheels. The advertisement should look like a real-world vehicle wrap with vivid colors, proper lighting reflections on the car's surface, and authentic branding that appears professionally installed. The background should clearly show Indian context (Indian architecture, signage in Hindi/regional languages, Indian street elements). The overall composition should showcase the logo as the focal point of a striking road marketing campaign in India.",
        icon: BusIcon,
      },
    ]
  },
  {
    name: 'Urban & Retail',
    products: [
      {
        id: 'shopping-mall',
        name: 'Shopping Mall Ad',
        prompt: "Create an ultra-realistic, professional photograph from the stunning atrium of DLF Emporio, New Delhi, during peak evening hours. The camera is positioned on the second-floor balcony, capturing a dramatic downward angle at a massive 15-foot LED digital screen suspended from the ceiling. The screen displays a crystal-clear, high-resolution advertisement featuring the provided logo with perfect color saturation and brightness. The mall's architecture features soaring glass ceilings, polished Italian marble floors that reflect the ambient lighting, and gleaming chrome railings. The atrium is bustling with affluent Indian shoppers - families in designer clothing, young professionals, and couples - all moving naturally through the space. The lighting is a sophisticated mix of warm LED strips, natural skylight filtering through the glass ceiling, and the screen's vibrant glow creating beautiful reflections on the marble floors. Include realistic details like shop windows displaying luxury brands, people using escalators, security personnel, and the authentic atmosphere of a premium Indian shopping destination. The composition should emphasize the scale and grandeur of the space while making the advertisement the focal point. The final image must capture the aspirational lifestyle and luxury retail experience of modern India, with professional photography quality that looks like it could be from a high-end lifestyle magazine.",
        icon: ShoppingMallIcon,
      },
      {
        id: 'auto-canopy',
        name: 'Auto Canopy Tent',
        prompt: "Generate a lively, photorealistic daytime shot of a brand activation event at a popular public space in Chennai, like Marina Beach promenade. The centerpiece is a pristine promotional tent (auto canopy), fully branded with an advertisement featuring the provided logo. The shot captures energetic brand ambassadors in uniform interacting with a curious crowd. The bright, coastal sunlight should create a cheerful, high-energy atmosphere. The final image must look like a professional event photograph, full of life and positive engagement.",
        icon: CanopyIcon,
      },
    ]
  }
];