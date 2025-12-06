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
  BridgeIcon,
  MagazineIcon,
  PillarIcon
} from './components/icons';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: 'In-Flight Experience',
    products: [
      {
        id: 'aircraft-exterior',
        name: 'Aircraft Exterior',
        prompt: "Professional aviation photography: Brand new Airbus A350-900 with PURE WHITE LIVERY (brilliant white base paint, Pantone White or RAL 9016 equivalent) positioned on the tarmac at Mumbai's Chhatrapati Shivaji International Airport Terminal 2 during the golden hour (30 minutes before sunset). The aircraft features a pristine white fuselage and white tail fin, ensuring maximum contrast and visibility for the brand logo application. Shot from a low angle using a Canon EOS-1D X Mark III with a 24-70mm f/2.8 lens at 35mm, f/5.6, creating a heroic perspective that emphasizes the aircraft's scale and modern design. The pure white fuselage prominently displays the provided logo as clean, professional aircraft branding - simple and elegant without additional text or graphics (following aviation industry standards where less is more). The logo should be perfectly scaled and positioned prominently on the forward fuselage section (approximately 6m x 4m logo size on the front fuselage, positioned behind the cockpit windows for optimal visibility). The white tail fin should also display the logo in a coordinated size and position (approximately 4m x 3m logo size centered on the tail fin). The entire branding treatment should appear as premium vinyl wrap installation on the brilliant white surface with realistic light reflections, flawless finish quality, and the sophisticated simplicity characteristic of high-end aircraft livery designs—the white background ensures the logo colors stand out with perfect clarity and maximum visual impact. The wet tarmac from recent monsoon rain creates mirror-like reflections of the pristine white aircraft and the dramatic sky painted in warm orange, pink, and purple hues characteristic of Mumbai coastal sunsets. The white aircraft reflects the golden sunset colors beautifully, creating a stunning interplay of warm light on the clean white surface. Include authentic airport details: ground crew in Air India uniforms performing safety checks, GPU (ground power unit) connected to aircraft, orange safety cones positioned correctly, Terminal 2's distinctive peacock-inspired architecture visible in the background, Airbus winglets with proper aerodynamic design, realistic aircraft registration numbers (black text on white fuselage), and the authentic busy atmosphere of India's second-busiest airport. The lighting should capture the natural golden hour warmth with soft shadows under the aircraft belly, realistic reflections on the glossy white fuselage showing warm sunset tones, the logo appearing vibrant and perfectly readable against the white background, and the characteristic gradient of sunset colors washing over the aircraft. The white paint should appear pristine and well-maintained, showing subtle variations in tone from the golden light (warmer tones on sun-facing surfaces, cooler tones in shadows) while maintaining the overall brilliant white appearance. The image must have the professional quality of aerospace marketing photography with natural film grain texture (Kodak Portra 400 aesthetic), sharp focus on the logo branding, and depth of field that keeps the aircraft sharp while gently blurring the background Terminal 2 architecture. The white livery creates a premium, clean aesthetic perfect for showcasing brand logos with maximum visibility and impact. Avoid any CGI or over-processed digital appearance.",
        icon: PlaneIcon,
      },
      
    ]
  }
];