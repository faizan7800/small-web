import type { Via } from '../database/schemas/visit.schema.js';

// Everything here is invented for this project. Addresses are fixed, so the same
// seed always produces the same web and the same walk can be repeated.

export const PEOPLE = ['Ines', 'Marin', 'Priya', 'Tomas', 'Wren', 'Joss'];

export interface SeedSite {
  address: string;
  title: string;
  author: string;
  html: string;
}

export const SITES: SeedSite[] = [
  {
    address: 'start.zz',
    title: 'Start here: a hand-kept list',
    author: 'Wren',
    html: `<h1>Start here</h1>
<p>This page is kept by Wren, who got tired of losing track of the good corners of the small web. It is not a search engine. It is a list, kept by hand, and it is allowed to be wrong.</p>
<h2>Weather and water</h2>
<ul>
<li><a href="almanac.zz">The Almanac</a>: a year of local weather, written down every evening.</li>
<li><a href="tidepool.zz">Tidepool</a>: slow notes on the shoreline between tides.</li>
<li><a href="lighthouse.zz">Lighthouse</a>: what keepers really did all night.</li>
</ul>
<h2>Kitchen</h2>
<ul>
<li><a href="sourdough.zz">Sourdough</a>: a starter is a pet that eats flour.</li>
<li><a href="kettle.zz">Kettle</a>: tea, temperature and patience.</li>
</ul>
<h2>Soil</h2>
<ul>
<li><a href="moss.zz">Moss</a>: a garden that asks for very little.</li>
<li><a href="compost.zz">Compost</a>: where everything goes in the end.</li>
</ul>
<h2>Machines and streets</h2>
<ul>
<li><a href="nightbus.zz">Night bus</a>: the routes after midnight.</li>
<li><a href="typewriter.zz">Typewriter</a>: repair notes from a cluttered bench.</li>
</ul>
<h2>Not yet written</h2>
<p>Someone promised a page about the salt flats at <a href="saltflats.zz">saltflats.zz</a>, but it has never arrived.</p>`,
  },
  {
    address: 'tidepool.zz',
    title: 'Tidepool: notes from the slow shoreline',
    author: 'Marin',
    html: `<h1>Tidepool</h1>
<p>Twice a day the sea walks out and leaves a small world behind. A tidepool is a rock basin that holds seawater until the tide returns, and for a few hours it is its own country: anemones, hermit crabs, limpets clamped to the stone, and a great deal of salt.</p>
<h2>How I read the tide</h2>
<p>I keep a notebook by the door. Low water comes about an hour later each day, and the lowest tides arrive around the new and full moon. If the <a href="almanac.zz">almanac</a> promises a calm morning and a spring tide, I go.</p>
<p>Fog changes everything. On foggy mornings the pools are quiet and cold, and the only sound is water finding its way back. The keepers of the old <a href="lighthouse.zz">lighthouse</a> up the coast wrote about the same fog for a hundred years.</p>
<p>There is supposed to be a better pool at <a href="ghostpier.zz">the ghost pier</a>, but nobody I know has ever found it.</p>`,
  },
  {
    address: 'lighthouse.zz',
    title: 'Lighthouse: what the keepers did at night',
    author: 'Marin',
    html: `<h1>Lighthouse</h1>
<p>People imagine a keeper sitting in the lamp room admiring the sea. The truth was closer to housework. Every night the lens had to be wound, the brass polished, the wicks trimmed, and the logbook filled in before dawn.</p>
<h2>The log</h2>
<p>Each entry noted wind, visibility and anything that passed. In fog the keeper also sounded the horn by hand, one long blast every thirty seconds, for as long as the fog lasted. One entry from a bad November records nineteen hours of horn.</p>
<p>The rocks below are the same ones I write about on <a href="tidepool.zz">Tidepool</a>. The tide timetable on that page was copied from the old logbooks, and the weather summaries come from the <a href="almanac.zz">almanac</a>.</p>
<p>A second keeper's diary was meant to be published at <a href="lostlantern.zz">lostlantern.zz</a>, but that page never existed.</p>`,
  },
  {
    address: 'sourdough.zz',
    title: 'Sourdough: a starter is a pet that eats flour',
    author: 'Priya',
    html: `<h1>Sourdough</h1>
<p>A sourdough starter is flour and water that has been left alone long enough for wild yeast and friendly bacteria to move in. Feed it daily, keep it warm, and it will bubble, smell faintly of apples, and raise bread without any packet of yeast.</p>
<h2>My routine</h2>
<p>Every morning I discard half, add equal weights of flour and water, and stir. Warm kitchens make the starter hungry; cold ones make it slow. I check the temperature against the <a href="almanac.zz">almanac</a> before deciding when to mix the dough.</p>
<p>The discard is never wasted. Pancakes, crackers and, when I am out of ideas, the <a href="compost.zz">compost</a> heap. With a pot of tea from <a href="kettle.zz">the kettle page</a> it is a good way to spend a Sunday.</p>
<p>A pinch of salt goes into the dough, not the starter. Salt slows the yeast.</p>`,
  },
  {
    address: 'kettle.zz',
    title: 'Kettle: tea, temperature and patience',
    author: 'Priya',
    html: `<h1>Kettle</h1>
<p>Most bad tea is just water that was too hot. Green tea wants water well below boiling, around eighty degrees; black tea can take it hotter. A kettle with a temperature dial is worth every penny, and a thermometer is worth more.</p>
<h2>Steeping</h2>
<p>Three minutes for black, two for green, longer for herbal. Set a timer. Patience is most of the skill.</p>
<p>I drink tea with whatever bread is ready, so see my notes on <a href="sourdough.zz">sourdough</a>. A friend who fixes old machines swears by strong tea at the workbench, and writes about it at <a href="typewriter.zz">typewriter.zz</a>. More small corners are listed on <a href="start.zz">the start page</a>.</p>`,
  },
  {
    address: 'moss.zz',
    title: 'Moss: a garden that asks for very little',
    author: 'Tomas',
    html: `<h1>Moss</h1>
<p>Moss has no roots, only tiny anchors, and it drinks through its leaves. That is why it grows on stone, on roofs, and in the shaded corner where nothing else will. A moss garden wants shade, damp air and acid soil, and almost nothing else.</p>
<h2>Keeping it alive</h2>
<p>Water it with rainwater if you can, because tap water is often too alkaline. Keep leaves off it, press it flat onto bare soil, and do not walk on it. Damp is the whole secret: moss dries out in a day of sun and recovers in an hour of rain.</p>
<p>The soil underneath comes from my <a href="compost.zz">compost</a> bins, sieved fine. Near the shoreline, the damp from sea fog gives moss gardens a head start, as described on <a href="tidepool.zz">Tidepool</a>.</p>
<p>My planting records were going to live at <a href="mossrecords.zz">mossrecords.zz</a>, but I never got round to it.</p>`,
  },
  {
    address: 'compost.zz',
    title: 'Compost: where everything goes in the end',
    author: 'Tomas',
    html: `<h1>Compost</h1>
<p>A compost heap is a slow kitchen for worms and microbes. Keep a balance of green material, like peelings and grass, and brown material, like dry leaves and cardboard. Too wet and it smells; too dry and nothing happens.</p>
<h2>What goes in</h2>
<p>Vegetable scraps, coffee grounds, tea leaves, eggshells and torn paper. Not meat, not oil. If you bake bread, the discard from a <a href="sourdough.zz">sourdough</a> starter is welcome in small amounts.</p>
<p>Turn the heap every few weeks. In summer it can be ready in two months; in winter, closer to six. I track the heap's temperature against the <a href="almanac.zz">almanac</a>. The finished soil goes straight into the <a href="moss.zz">moss</a> beds.</p>`,
  },
  {
    address: 'almanac.zz',
    title: 'Almanac: a year of weather, written down',
    author: 'Wren',
    html: `<h1>Almanac</h1>
<p>Since the first of January I have written down the weather every evening: temperature, wind, cloud, rain and anything unusual. It is the least glamorous project on the small web, and I am rather proud of it.</p>
<h2>Patterns so far</h2>
<p>Fog arrives in autumn, mostly before nine in the morning, and clears by lunch. The warmest week was in July. The wettest single day brought more rain than the whole of April.</p>
<p>The people who ask for this page most are the shoreline people: see <a href="tidepool.zz">Tidepool</a> for what they do with it. Night-shift workers also check it before the first <a href="nightbus.zz">night bus</a>. Other places worth visiting are on the <a href="start.zz">start page</a>.</p>`,
  },
  {
    address: 'nightbus.zz',
    title: 'Night bus: the routes after midnight',
    author: 'Joss',
    html: `<h1>Night bus</h1>
<p>After midnight the city runs on four routes. They are slow, they smell of cold chips and wet coats, and they are the only way home for a lot of people who work late. I ride them and write them down.</p>
<h2>The routes</h2>
<p>The N1 loops the old town. The N2 goes out to the hospital and the industrial estate. The N3 is the one everybody wants, because it passes the bakery just as the first loaves come out. The N4 is mostly empty and very warm.</p>
<p>Fog and heavy rain delay everything, so check the <a href="almanac.zz">almanac</a> first. A friend who repairs old machines keeps the workshop open late, see <a href="typewriter.zz">typewriter.zz</a>. A fifth route, the N5, is rumoured at <a href="route99.zz">route99.zz</a>, but that page does not exist.</p>`,
  },
  {
    address: 'typewriter.zz',
    title: 'Typewriter: repair notes from a cluttered bench',
    author: 'Joss',
    html: `<h1>Typewriter</h1>
<p>A manual typewriter is a machine you can understand completely. Every key, spring and lever does exactly one job, and when something sticks you can usually see why. I buy broken ones for almost nothing and bring them back to life.</p>
<h2>Common faults</h2>
<p>A sticky carriage usually means old oil has turned to varnish; wash it with a little solvent and a soft brush. Uneven letters mean the platen has hardened. Skipped spaces point to a tired mainspring. Patience and a good light fix most of it.</p>
<p>I work late, usually with a pot of strong tea, which is why <a href="kettle.zz">the kettle page</a> is bookmarked here, and I ride the <a href="nightbus.zz">night bus</a> home. Come back to <a href="start.zz">the start page</a> for more.</p>`,
  },
];

// One hour of browsing history, handwritten so it is easy to reason about.
// A plain string = followed a link (the first step of a trail = typed the address).
// A pair = a specific way of arriving. Several addresses here do not exist on purpose.
export type Step = string | [address: string, via: Via];

export const TRAILS: Record<string, Step[]> = {
  // Has been nearly everywhere, with repeats and three dead ends.
  Ines: [
    'start.zz', 'almanac.zz', 'tidepool.zz', 'ghostpier.zz', ['tidepool.zz', 'history'],
    'lighthouse.zz', 'lostlantern.zz', ['lighthouse.zz', 'history'], ['sourdough.zz', 'typed'],
    'kettle.zz', 'typewriter.zz', 'nightbus.zz', 'route99.zz', ['almanac.zz', 'history'],
    ['compost.zz', 'search'], 'moss.zz', ['start.zz', 'typed'], 'saltflats.zz',
  ],
  Marin: ['tidepool.zz', 'almanac.zz', ['tidepool.zz', 'history'], 'lighthouse.zz', 'tidepool.zz', ['moss.zz', 'search'], 'compost.zz'],
  Priya: ['kettle.zz', 'sourdough.zz', 'compost.zz', ['sourdough.zz', 'history'], 'almanac.zz', ['kettle.zz', 'typed'], 'typewriter.zz', 'nightbus.zz'],
  Tomas: ['compost.zz', 'moss.zz', 'tidepool.zz', 'mossrecords.zz', ['moss.zz', 'history'], ['sourdough.zz', 'search'], 'kettle.zz'],
  Wren: ['start.zz', 'almanac.zz', 'tidepool.zz', ['almanac.zz', 'history'], 'nightbus.zz', 'typewriter.zz', ['start.zz', 'typed']],
  Joss: ['typewriter.zz', 'kettle.zz', 'sourdough.zz', ['typewriter.zz', 'history'], 'nightbus.zz', 'almanac.zz', 'route99.zz'],
};
