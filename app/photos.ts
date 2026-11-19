// Every photo on the site lives in this file, grouped the way the pages use
// them. To add a photo: put the JPG in public/photos, run
// `python scripts/optimize-photos.py`, then add one line to the right list.
export type Photo={src:string;alt:string;label:string;layout?:string;cat?:string};
export type Clip={video:string;poster:string;label:string;aria:string};
export type Item=Photo|Clip;
export const isClip=(item:Item):item is Clip=>'video' in item;
export const web=(src:string,sizes:string)=>{const name=src.replace('/photos/','').replace('.jpg','');const at=(width:number)=>`/photos/web/${name}-${width}.webp`;return {src:at(1600),srcSet:`${at(640)} 640w, ${at(1080)} 1080w, ${at(1600)} 1600w`,sizes}};
export const sharedMoments:Photo[]=[
{src:'/photos/haystack-friends.jpg',alt:'Two congregation friends smiling beside a haystack',label:'Country-road smiles'},
{src:'/photos/fresh-coconuts.jpg',alt:'A fresh harvest of green coconuts',label:'From the garden'},
{src:'/photos/table-feast.jpg',alt:'Colorful homemade food prepared for a shared meal',label:'A table full of love'},
{src:'/photos/old-tree-friends.jpg',alt:'Two friends pausing beneath an old tree in Phatthalung',label:'Stories along the way'},
{src:'/photos/shared-feast.jpg',alt:'A generous Thai meal prepared to share with friends',label:'Made to be shared'},
{src:'/photos/marigold-field.jpg',alt:'A joyful visit to a bright marigold field',label:'Bright days out'},
{src:'/photos/coconut-smile.jpg',alt:'A friend enjoying fresh coconut water on a country road',label:'Simple refreshments'},
{src:'/photos/sunflower-group.jpg',alt:'Friends smiling together in a sunflower garden',label:'Days out together'},
{src:'/photos/rice-fields-walk.jpg',alt:'Two friends walking beside green rice fields',label:'Side by side'},
{src:'/photos/scooter-fields.jpg',alt:'Friends riding through the Phatthalung countryside',label:'The road home'},
{src:'/photos/country-bridge.jpg',alt:'A friend crossing a small countryside bridge',label:'Every corner explored'},
{src:'/photos/kitten-friend.jpg',alt:'A friend holding a small grey kitten',label:'Little joys'},
{src:'/photos/memory-group-portrait.jpg',alt:'Congregation friends sharing a playful group portrait',label:'A room full of smiles'},
{src:'/photos/memory-heart-selfie.jpg',alt:'Young friends making heart shapes together for a cheerful selfie',label:'Sending a little love'},
{src:'/photos/memory-neighborly-visit.jpg',alt:'Two older women enjoying a warm conversation during a visit',label:'Time for a good conversation'}];
export const activityPhotos:Photo[]=[
{cat:'roads',src:'/photos/activity-motorbike-day.jpg',alt:'Friends gathering around a motorbike on a bright day in town',label:'Make the journey part of the fun',layout:'activity-tall'},
{cat:'town',src:'/photos/activity-mural-walk.jpg',alt:'Friends walking beside a colorful neighborhood mural in Phatthalung',label:'Find color down a side street',layout:'activity-wide'},
{cat:'markets',src:'/photos/activity-night-market.jpg',alt:'An evening market and live event beneath Phatthalung limestone hills',label:'Stay out for a local night market',layout:'activity-tall'},
{cat:'town',src:'/photos/activity-train-station.jpg',alt:'The railway tracks and platform at Phatthalung station',label:'Watch the town arrive by train'},
{cat:'roads',src:'/photos/activity-motorbike-friends.jpg',alt:'Two friends ready for a motorbike ride through Phatthalung',label:'Take a ride with a friend'},
{cat:'town',src:'/photos/activity-doorway-friends.jpg',alt:'Two friends sharing a laugh beneath an umbrella',label:'Pause for the people you meet'},
{cat:'roads',src:'/photos/activity-mountain-stop.jpg',alt:'Friends stopping beneath a striking limestone mountain',label:'Turn an everyday stop into a photo stop',layout:'activity-wide'},
{cat:'markets',src:'/photos/activity-coffee-carnival.jpg',alt:'Coffee Carnival sign at a lively outdoor night event',label:'Follow the lights to a local event',layout:'activity-tall'},
{cat:'markets',src:'/photos/activity-durian-stop.jpg',alt:'Fresh durian and watermelons at a roadside fruit stand',label:'Try fruit from a roadside stand'},
{cat:'food',src:'/photos/activity-lakeside-cafe.jpg',alt:'Desserts and drinks at a lakeside cafe during sunset',label:'Slow down at a lakeside café',layout:'activity-wide'},
{cat:'food',src:'/photos/activity-box-pancakes.jpg',alt:'A tall stack of fluffy pancakes at The Box Phatthalung',label:'Share something sweet'},
{cat:'food',src:'/photos/activity-baramio-coffee.jpg',alt:'A colorful iced drink topped with fried dough at a local coffee shop',label:'Find a new favorite drink'},
{cat:'food',src:'/photos/activity-local-meal.jpg',alt:'A plate of rice and local dishes prepared for friends',label:'Taste a home-style meal'},
{cat:'food',src:'/photos/activity-basil-rice.jpg',alt:'Thai basil pork with rice and a crispy fried egg',label:'Order a comforting classic'},
{cat:'food',src:'/photos/activity-table-grill.jpg',alt:'Friends cooking together around a tabletop grill',label:'Cook and talk around the table',layout:'activity-wide'},
{cat:'food',src:'/photos/activity-steak-dinner.jpg',alt:'Steak over rice with a cold drink shared at dinner',label:'End the day with a good meal',layout:'activity-wide'},
{cat:'roads',src:'/photos/activity-rice-field-riders.jpg',alt:'Friends pausing together on motorbikes beside vivid green rice fields',label:'Ride the country roads together',layout:'activity-wide'},
{cat:'roads',src:'/photos/activity-rice-field-rider.jpg',alt:'A motorbike rider pausing beside green rice fields and limestone hills',label:'Stop wherever the view asks you to',layout:'activity-wide'},
{cat:'roads',src:'/photos/activity-mountain-coffee-cart.jpg',alt:'A small coffee cart beside the road with Khao Ok Thalu beyond',label:'Find coffee with a mountain view',layout:'activity-tall'},
{cat:'food',src:'/photos/activity-green-cafe-drink.jpg',alt:'A bright green cafe drink shared at a table with friends',label:'Try something new at a local café',layout:'activity-tall'},
{cat:'food',src:'/photos/little-pad-thai-view.jpg',alt:'Two plates of pad thai served at a table overlooking green rice fields',label:'Eat pad thai with a rice-field view',layout:'activity-tall'}];
export const naturePhotos:Photo[]=[
{src:'/photos/nature-mountain-walk.jpg',alt:'A friend walking beside a lake beneath a forested limestone mountain',label:'Limestone peaks beside the water',layout:'nature-mountain'},
{src:'/photos/nature-cattle.jpg',alt:'Two cattle standing beneath trees beside the water',label:'Quiet neighbors along the road',layout:'nature-cattle'},
{src:'/photos/nature-garden-sunset.jpg',alt:'A peaceful garden glowing beneath a warm Phatthalung sunset',label:'Green spaces at the close of day',layout:'nature-garden'},
{src:'/photos/nature-rock-pool.jpg',alt:'Friends swimming in a clear rocky pool surrounded by forest',label:'Cool water beneath the trees',layout:'nature-swim'},
{src:'/photos/nature-mountain-panorama.jpg',alt:'A wide view of forested Phatthalung mountains beneath a dramatic blue sky',label:'A horizon shaped by mountains',layout:'nature-panorama'},
{src:'/photos/nature-forest-stream.jpg',alt:'A clear forest stream flowing between smooth rocks beneath the trees',label:'Follow the sound of the stream',layout:'nature-stream'},
{src:'/photos/nature-forest-friends.jpg',alt:'Two friends leaning close together on a green forest path',label:'Friendship feels at home here',layout:'nature-friends'}];
export const starterItems=[
{icon:'☂',name:'An umbrella',note:'For sun, rain, and everything between.'},
{icon:'◌',name:'Mosquito spray',note:'A tiny bottle with heroic responsibilities.'},
{icon:'🥤',name:'An iced coffee',note:'The unofficial fuel of a warm afternoon.'},
{icon:'⛑',name:'A motorbike helmet',note:'The countryside is best explored safely.'},
{icon:'🍜',name:'Something delicious',note:'There is always room for one more local favorite.'},
{icon:'📷',name:'A camera',note:'Because the ordinary views rarely feel ordinary.'},
{icon:'☺',name:'A good attitude',note:'The one thing every plan needs.'}];
export const adventures=[
{title:'A country-road ride',note:'Take the long way and let the mountains set the pace.'},
{title:'A local café stop',note:'Order something cold and stay for the conversation.'},
{title:'A food adventure',note:'Choose a place that smells good and share everything.'},
{title:'A waterfall swim',note:'Find cool water beneath the trees.'},
{title:'An evening market',note:'Follow the lights, music, and something good to eat.'},
{title:'A mountain walk',note:'Look up, slow down, and enjoy the view.'},
{title:'Preaching and visiting',note:'Encouragement for us—and for the people we meet.'}];
export const littleThings:Photo[]=[
{src:'/photos/little-umbrella-flowers.jpg',alt:'A congregation friend standing beneath an umbrella beside bright pink flowers',label:'A little shade on a bright day',layout:'little-tall'},
{src:'/photos/little-coconut-friends.jpg',alt:'Friends sharing fresh coconuts beneath the palm trees',label:'Fresh coconuts, passed around',layout:'little-wide'},
{src:'/photos/little-umbrella-group.jpg',alt:'Friends pausing beneath umbrellas on a sunny country road',label:'Prepared for sun, rain, and a good day',layout:'little-wide'},
{src:'/photos/little-picnic-table.jpg',alt:'Older congregation friends talking together beside an outdoor picnic table',label:'Conversations that stretch through lunch',layout:'little-wide'},
{src:'/photos/little-village-visit.jpg',alt:'Friends visiting with a neighbor along a quiet village lane',label:'A warm welcome at the gate',layout:'little-tall'},
{src:'/photos/little-flower-walk.jpg',alt:'Two friends walking together beside a wall of pink flowers',label:'Walking on, still talking',layout:'little-tall'},
{src:'/photos/little-rice-field-stop.jpg',alt:'A farmer and motorbike resting beneath a large tree beside vivid rice fields',label:'A familiar view worth stopping for',layout:'little-wide'},
{src:'/photos/little-palm-field-smile.jpg',alt:'A congregation friend smiling beneath a palm beside a green rice field',label:'A wave from the road',layout:'little-tall'},
{src:'/photos/little-stream-hearts.jpg',alt:'Four congregation friends making heart shapes together beside a forest stream',label:'A little love by the water',layout:'little-wide'}];

export const lifeHere:Photo[]=[
{src:'/photos/village-wheel.jpg',alt:'A vintage village Ferris wheel with Phatthalung mountains beyond',label:'A little surprise around the corner'},
{src:'/photos/lotus-scene.jpg',alt:'Pink lotus flowers stretching across the water at Thale Noi',label:'Lotus mornings at Thale Noi'},
{src:'/photos/phatthalung-mountain.jpg',alt:'A distinctive limestone mountain beneath bright Phatthalung skies',label:'Phatthalung’s unmistakable landscape'}];
export const onlyHere:Photo[]=[
{src:'/photos/only-cave-window.jpg',alt:'A cave opening framing a high view over Phatthalung town',label:'A window in the mountain'},
{src:'/photos/dinosaur-summit.jpg',alt:'A playful dinosaur costume at a Phatthalung mountain summit',label:'Yes, the dinosaur made it to the top'},
{src:'/photos/only-cow-cliff.jpg',alt:'A small cow standing beneath a broad limestone cliff',label:'Local scale: cow for reference'}];
export const alongTheWay:Photo[]=[
{src:'/photos/ministry-street-group.jpg',alt:'A joyful congregation group together on a Phatthalung street',label:'Ready to share a good day together'},
{src:'/photos/banana-road.jpg',alt:'Friends walking under umbrellas along a sunny banana-lined road',label:'Shade, stories, and the road ahead'},
{src:'/photos/flower-friends.jpg',alt:'Two friends smiling together among bright orange flowers',label:'Friendship in full color'},
{src:'/photos/scooter-smiles.jpg',alt:'Two friends smiling together on a motorbike',label:'Getting there together'},
{src:'/photos/garden-greens.jpg',alt:'Friends happily gathering fresh greens beside a country road',label:'Little gifts from the garden'},
{src:'/photos/resting-together.jpg',alt:'Two friends resting and laughing together after a warm day',label:'Time to pause'},
{src:'/photos/moon-mountain.jpg',alt:'A friend framing the moon above a Phatthalung mountain',label:'Wonder at the end of the day'},
{src:'/photos/green-rice-fields.jpg',alt:'Vivid green rice fields stretching toward the Phatthalung mountains',label:'Green horizons close to home'},
{src:'/photos/sunset-town.jpg',alt:'A vivid sunset glowing above Phatthalung town',label:'Evenings painted in color'},
{src:'/photos/village-walk.jpg',alt:'Two friends walking together down a peaceful village road',label:'Side by side, all the way home'}];
export const together:Photo[]=[
{src:'/photos/cheerful-congregation.jpg',alt:'Congregation friends sharing a cheerful moment together',label:'One congregation'},
{src:'/photos/rice-field-friends.jpg',alt:'Friends walking side by side through vivid green rice fields',label:'Sharing the work and the road together'}];
export const postcardOne:Clip={video:'/videos/phatthalung-postcard-one.mp4',poster:'/videos/phatthalung-postcard-one-poster.webp',label:'A tiny moving postcard',aria:'A short moving postcard from Phatthalung'};
export const postcardTwo:Clip={video:'/videos/phatthalung-postcard-two.mp4',poster:'/videos/phatthalung-postcard-two-poster.webp',label:'One more moment in motion',aria:'A short congregation moment in Phatthalung'};

/* Gallery pages. Each group becomes a filter chip on its page. */
export type Group={id:string;label:string;items:Item[]};
export type Gallery={slug:string;href:string;kicker:string;title:string;titleEm:string;intro:string;cover:Photo;groups:Group[];notes?:{title:string;text:string}[]};
const byCat=(cat:string)=>activityPhotos.filter(photo=>photo.cat===cat);
export const galleries:Gallery[]=[
{slug:'things-to-do',href:'/things-to-do',kicker:'A DAY OUT, PHATTHALUNG STYLE',title:'What to do',titleEm:'in Phatthalung?',intro:'Follow a side street, take the train, ride beneath the mountains, find a market after dark, or settle around a table. The best plan is often simply choosing somewhere to go—and bringing friends.',cover:activityPhotos[16],groups:[
{id:'town',label:'Explore the town',items:byCat('town')},
{id:'roads',label:'Ride the local roads',items:byCat('roads')},
{id:'markets',label:'Markets & events',items:byCat('markets')},
{id:'food',label:'Eat, drink & linger',items:byCat('food')}]},
{slug:'nature',href:'/nature',kicker:'THE PLACE WE CALL HOME',title:'Life grows',titleEm:'all around us.',intro:'Lotus water, limestone mountains, forest streams, and the animals we meet along the way give Phatthalung its gentle rhythm—and its own wonderful sense of humor.',cover:naturePhotos[0],groups:[
{id:'life-here',label:'Life here',items:lifeHere},
{id:'wildlife',label:'Wildlife & nature',items:naturePhotos},
{id:'only-here',label:'Only in Phatthalung',items:[...onlyHere,postcardOne]}],
notes:[{title:'Look toward the peaks',text:'Limestone mountains rise suddenly above fields, roads, and water.'},{title:'Notice everyday wildlife',text:'Animals are part of the landscape, often just beyond the roadside.'},{title:'Stay for the evening light',text:'Gardens and green spaces soften as the sun goes down.'}]},
{slug:'moments',href:'/moments',kicker:'SHARED MOMENTS',title:'Ordinary days,',titleEm:'shared with joy.',intro:'Village roads, shared shade, roadside lunches, long conversations, and a wave across the rice fields—the small things are often the ones we remember most.',cover:alongTheWay[0],groups:[
{id:'along-the-way',label:'Along the way',items:alongTheWay},
{id:'little-things',label:'Little things we love',items:[...littleThings.slice(0,5),postcardTwo,...littleThings.slice(5)]},
{id:'shared',label:'Work, laughter & food',items:sharedMoments}]}];
export const photoCount=(gallery:Gallery)=>gallery.groups.reduce((sum,group)=>sum+group.items.filter(item=>!isClip(item)).length,0);
export const galleryBySlug=(slug:string)=>galleries.find(gallery=>gallery.slug===slug)!;

/* Story bubbles on the home page: a short, hand-picked run from each gallery. */
export const pick=(list:Photo[],names:string[])=>names.map(name=>list.find(photo=>photo.src.includes(`/${name}.jpg`))!);
export type Story={id:string;label:string;cover:Photo;slides:Photo[];cta:{label:string;href:string}};
export const stories:Story[]=[
{id:'together',label:'Together',cover:together[0],slides:[together[0],together[1],...pick(sharedMoments,['memory-group-portrait','memory-heart-selfie','memory-neighborly-visit']),...pick(alongTheWay,['ministry-street-group'])],cta:{label:'Come and meet us',href:'#visit'}},
{id:'things-to-do',label:'Things to do',cover:activityPhotos[16],slides:pick(activityPhotos,['activity-rice-field-riders','activity-night-market','activity-mural-walk','activity-lakeside-cafe','activity-train-station','activity-mountain-coffee-cart','activity-table-grill','little-pad-thai-view']),cta:{label:`See all ${activityPhotos.length} photos`,href:'/things-to-do'}},
{id:'nature',label:'Nature',cover:lifeHere[1],slides:[lifeHere[1],...pick(naturePhotos,['nature-mountain-walk','nature-rock-pool','nature-cattle','nature-mountain-panorama','nature-forest-stream']),onlyHere[1]],cta:{label:'See the full nature gallery',href:'/nature'}},
{id:'moments',label:'Moments',cover:littleThings[8],slides:[littleThings[8],...pick(alongTheWay,['banana-road','scooter-smiles','moon-mountain']),littleThings[1],...pick(sharedMoments,['table-feast','sunflower-group','kitten-friend'])],cta:{label:'See all the moments',href:'/moments'}}];
