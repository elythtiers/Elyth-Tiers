import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

const SUPABASE_URL = "https://mpjbysbmgxvzaskcjtfm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wamJ5c2JtZ3h2emFza2NqdGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY2NDksImV4cCI6MjA5MDAzMjY0OX0.zmpQSgWReAYUh2mL6Vyjti3wf7xybBu4H_RyUc1tU-k";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const getDisplayName = (p) => p.name || "Unknown";

const categories = [
  "Overall","Sword","Axe","UHC","NethOP","Pot","Mace","Crystal","SMP","DiamondSMP","Cart"
];

const getCategoryLabel = (cat, lang) => {
  if (lang === "en") return cat;
  switch(cat){
    case "Overall": return "Genel";
    case "Sword": return "Kılıç";
    case "Axe": return "Balta";
    case "UHC": return "UHC";
    case "NethOP": return "NethOP";
    case "Pot": return "Pot";
    case "Mace": return "Mace";
    case "Crystal": return "Kristal";
    case "SMP": return "SMP";
    case "DiamondSMP": return "Diamond SMP";
    case "Cart": return "Cart";
    default: return cat;
  }
};

const logos = {
  Overall: "https://trtier.com/images/overall.svg",
  Sword: "https://trtier.com/images/sword.svg",
  Axe: "https://trtier.com/images/axe.svg",
  UHC: "https://trtier.com/images/uhc.svg",
  NethOP: "https://trtier.com/images/nethop.svg",
  Pot: "https://trtier.com/images/pot.svg",
  Mace: "https://trtier.com/images/mace.svg",
  Crystal: "https://trtier.com/images/vanilla.svg",
  SMP: "https://trtier.com/images/smp.svg",
  DiamondSMP: "https://trtier.com/images/diasmp.png",
  Cart: "https://www.subtiers.net/assets/minecart-e4204998.svg"
};

const modes = categories.filter(c => c !== "Overall");

const calculateOverall = (player) => modes.reduce((sum, m) => sum + (player[m] || 0), 0);

const ranks = [
  { min: 45, color: "magenta" },
  { min: 30, color: "blue" },
  { min: 20, color: "gold" },
  { min: 10, color: "silver" },
  { min: 4, color: "bronze" },
  { min: 0, color: "gray" }
];

const overallRanks = [
  { min: 300, color: "magenta" },
  { min: 150, color: "blue" },
  { min: 100, color: "gold" },
  { min: 60, color: "silver" },
  { min: 40, color: "bronze" },
  { min: 0, color: "gray" }
];

const getRank = (points, mode) => {
  const table = mode === "Overall" ? overallRanks : ranks;
  return table.find(r => points >= r.min)?.color || "gray";
};

const getTierLabel = (points, mode, lang) => {
  if (mode === "Overall") return points;
  if (points === 0) return lang === "en" ? "Unranked" : "Sıralamasız";

  switch (points) {
    case 60: return "HT1";
    case 45: return "LT1";
    case 30: return "HT2";
    case 20: return "LT2";
    case 10: return "HT3";
    case 6: return "LT3";
    case 4: return "HT4";
    case 3: return "LT4";
    case 2: return "HT5";
    case 1: return "LT5";
    default: return points;
  }
};

const getRankColor = (color) => {
  switch (color) {
    case "magenta": return "bg-fuchsia-500 shadow-[0_0_15px_4px_rgba(217,70,239,0.9)]";
    case "blue": return "bg-blue-500 shadow-[0_0_15px_4px_rgba(59,130,246,0.9)]";
    case "gold": return "bg-yellow-400 shadow-[0_0_15px_4px_rgba(250,204,21,0.9)]";
    case "silver": return "bg-gray-300 shadow-[0_0_12px_3px_rgba(209,213,219,0.9)]";
    case "bronze": return "bg-amber-700 shadow-[0_0_12px_3px_rgba(180,83,9,0.9)]";
    case "gray": return "bg-gray-600 shadow-[0_0_10px_2px_rgba(75,85,99,0.9)]";
    default: return "bg-gray-700";
  }
};

const getPlacementBg = (i) => {
  if (i === 0) return "https://mctiers.com/placements/1-shimmer.svg";
  if (i === 1) return "https://mctiers.com/placements/2-shimmer.svg";
  if (i === 2) return "https://mctiers.com/placements/3-shimmer.svg";
  return "https://mctiers.com/placements/other.svg";
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [showInfo, setShowInfo] = useState(false);
  const [selected, setSelected] = useState("Overall");
  const [search, setSearch] = useState("");
  const [activePlayer, setActivePlayer] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => { fetchPlayers(); }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase.from("players").select("*");
    if (error) return console.error(error);

    const formatted = data.map((p) => {
      const player = {
        id: p.name,
        name: getDisplayName(p),
        region: p.region || "",
        Sword: p.sword || 0,
        Axe: p.axe || 0,
        UHC: p.uhc || 0,
        NethOP: p.nethop || 0,
        Pot: p.pot || 0,
        Mace: p.mace || 0,
        Crystal: p.crystal || 0,
        SMP: p.smp || 0,
        DiamondSMP: p.diamondsmp || 0,
        Cart: p.cart || 0
      };
      return { ...player, Overall: calculateOverall(player) };
    });

    setPlayers(formatted);
  };

  const sortedPlayers = useMemo(() => [...players].sort((a,b)=>(b[selected]||0)-(a[selected]||0)), [players, selected]);
  const overallSorted = useMemo(() => [...players].sort((a,b)=>b.Overall-a.Overall), [players]);

  const filtered = useMemo(() => {
    return sortedPlayers
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter(p => selected === "Overall" || (p[selected]||0) > 0)
      .slice(0,100);
  }, [sortedPlayers, search, selected]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex justify-center mb-6 relative">
        <motion.a href="https://discord.gg/p7jP2B5Bm" target="_blank" whileHover={{scale:1.05}} className="absolute left-0 top-0 bg-indigo-600 px-3 py-1 rounded-lg">
          {lang === "en" ? "Join Discord" : "Discord'a Katıl"}
        </motion.a>
        <motion.button onClick={()=>setShowInfo(true)} whileHover={{scale:1.05}} className="absolute right-0 top-0 bg-gray-700 px-3 py-1 rounded-lg">
          {lang === "en" ? "Info" : "Bilgi"}
        </motion.button>
        <button onClick={()=>setLang(lang === "en" ? "tr" : "en")} className="absolute right-0 top-10 bg-gray-800 px-3 py-1 rounded-lg text-sm">
          {lang === "en" ? "TR" : "EN"}
        </button>
        <img src="https://i.imgur.com/i9Yb26m.png" className="h-16 sm:h-20" />
      </div>

      {/* SEARCH */}
      <div className="mb-6 flex justify-center">
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder={lang === "en" ? "Search player..." : "Oyuncu ara..."}
          className="w-full max-w-md px-4 py-2 rounded-xl bg-gray-800 border border-gray-700" />
      </div>

      {/* BOX CONTAINER */}
      <div className="max-w-7xl mx-auto">

        {/* TABS */}
        <div className="mb-0 overflow-x-auto overflow-y-hidden border-b border-gray-700 bg-gray-800 rounded-t-xl">
          <div className="flex gap-1 px-2 justify-center">
            {categories.map(cat => (
              <motion.button key={getCategoryLabel(cat, lang)} onClick={()=>setSelected(cat)} whileHover={{scale:1.03}}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 border-b-2 ${selected===cat?"border-white bg-gray-900":"border-transparent hover:bg-gray-700"}`}>
                <img src={logos[cat]} className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">{getCategoryLabel(cat, lang)}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* LIST BOX */}
        <div className="bg-gray-800 rounded-b-xl p-4 space-y-3 border border-gray-700">
          {filtered.map(p => {
            const index = sortedPlayers.findIndex(sp=>sp.id===p.id);
            const rank = sortedPlayers.filter(sp => (sp[selected]||0) > (p[selected]||0)).length;
            const color = getRankColor(getRank(p[selected], selected));

            return (
              <motion.div key={p.id} onClick={()=>setActivePlayer(p)} whileHover={{scale:1.03}}
                className="bg-gray-900 rounded-xl flex items-center justify-between pr-2 cursor-pointer shadow-md overflow-hidden relative min-h-[90px] sm:min-h-[90px] border border-gray-600 max-w-5xl mx-auto">

                <div className="flex items-center">
                  <div className="absolute left-0 top-0 h-full w-[200px]" style={{backgroundImage:`url(${getPlacementBg(rank)})`, backgroundSize:"100% 100%", backgroundPosition:"left bottom", backgroundRepeat:"no-repeat"}}>
                    <img src={`https://render.crafty.gg/3d/bust/${p.name}`} className="absolute bottom-0 left-[70px] h-[90px] drop-shadow-[0_12px_16px_rgba(0,0,0,0.9)]" />
                    <span className="absolute top-2 left-6 text-5xl italic font-extrabold drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">{sortedPlayers.filter(sp => (sp[selected]||0) > (p[selected]||0)).length + 1}</span>
                  </div>
                  <div className="pl-[210px] pr-4 text-lg sm:text-xl font-bold">{p.name}</div>
                </div>

                <div className="flex items-center gap-6 mr-4">
                  {p.region && (
                    <span className="text-sm px-3 py-1.5 rounded-md bg-gray-700 font-semibold -ml-12">
                      {p.region}
                    </span>
                  )}
                  <div className={`${color} w-10 h-10 rounded-full flex items-center justify-center font-bold`}>
                    {getTierLabel(p[selected], selected, lang)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>


      {/* POPUP */}
      <AnimatePresence>
        {activePlayer && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={()=>setActivePlayer(null)}>
            <motion.div onClick={e=>e.stopPropagation()} className={`${(()=>{
              const i = overallSorted.findIndex(p=>p.id===activePlayer.id);
              if(i===0) return "bg-yellow-400 text-black";
              if(i===1) return "bg-gray-300 text-black";
              if(i===2) return "bg-amber-700 text-white";
              return "bg-gray-800 text-white";
            })()} p-6 rounded-2xl w-[90%] max-w-lg relative`}>

              <button onClick={()=>setActivePlayer(null)} className="absolute top-2 right-3 text-xl font-bold">✕</button>

              <div className="flex items-start gap-4 mb-4">
                <img src={`https://render.crafty.gg/3d/full/${activePlayer.name}`} className="h-40" />
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold">{activePlayer.name}</h2>
                  <div className="text-sm opacity-80">
                    {lang === "en" ? "Rank" : "Sıra"} #{overallSorted.findIndex(p=>p.id===activePlayer.id)+1}
                  </div>
                  <div className="mt-1 font-semibold">
                    {lang === "en" ? "Overall" : "Genel"}: {activePlayer.Overall}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {modes.map(m => (
                  <div key={getCategoryLabel(m, lang)} className="rounded px-2 py-1 flex justify-between bg-black/10 font-semibold">
                    <span>{getCategoryLabel(m, lang)}</span>
                    <span>{getTierLabel(activePlayer[m], m, lang)}</span>
                  </div>
                ))}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INFO */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center" 
            onClick={()=>setShowInfo(false)}
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
          >
            <motion.div 
              onClick={e=>e.stopPropagation()} 
              className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-md space-y-4"
              initial={{scale:0.9, opacity:0}}
              animate={{scale:1, opacity:1}}
              exit={{scale:0.9, opacity:0}}
              transition={{duration:0.2}}
            >

              <h2 className="font-bold text-lg">
                {lang === "en" ? "How ranking points are calculated" : "Puanlama nasıl hesaplanır"}
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="text-yellow-400 font-bold">🏆 {lang === "en" ? "Tier 1" : "Tier 1"}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↑ 60 {lang === "en" ? "Points" : "Puan"}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↓ 45 {lang === "en" ? "Points" : "Puan"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-gray-300 font-bold">🥈 {lang === "en" ? "Tier 2" : "Tier 2"}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↑ 30 {lang === "en" ? "Points" : "Puan"}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↓ 20 {lang === "en" ? "Points" : "Puan"}</span>
                  </div>
                </div>

                <div>
                  <div className="text-amber-600 font-bold">🥉 {lang === "en" ? "Tier 3" : "Tier 3"}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↑ 10 {lang === "en" ? "Points" : "Puan"}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↓ 6 {lang === "en" ? "Points" : "Puan"}</span>
                  </div>
                </div>

                <div>
                  <div className="font-bold">{lang === "en" ? "Tier 4" : "Tier 4"}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↑ 4 {lang === "en" ? "Points" : "Puan"}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↓ 3 {lang === "en" ? "Points" : "Puan"}</span>
                  </div>
                </div>

                <div>
                  <div className="font-bold">{lang === "en" ? "Tier 5" : "Tier 5"}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↑ 2 {lang === "en" ? "Points" : "Puan"}</span>
                    <span className="bg-gray-800 px-3 py-1 rounded-full">↓ 1 {lang === "en" ? "Point" : "Puan"}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
