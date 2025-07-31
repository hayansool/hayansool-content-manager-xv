"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, CheckCircle, Globe } from "lucide-react"

export default function MakgeolliContentManager() {
  const [activeTab, setActiveTab] = useState("content")
  const [recipes, setRecipes] = useState<any[]>([])
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("")
  const [currentLanguage, setCurrentLanguage] = useState<string>("ko")
  const [activeLanguageTab, setActiveLanguageTab] = useState("ko") // Moved hook to top level

  const languages = [
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ]

  // Translations for the interface
  const translations = {
    ko: {
      title: "하얀술 콘텐츠 매니저",
      subtitle: "커스텀 막걸리 101 콘텐츠 제작 및 관리",
      content: "콘텐츠",
      contentCount: "36개 콘텐츠",
      exportContent: "콘텐츠 내보내기",
      seriesOverview: "시리즈 개요",
      seriesDescription: "하얀술 레시피 시리즈별 구성",
      episode: "에피소드",
      recipes: "개 레시피",
      selected: "선택됨",
      clickToGenerate: "클릭하여 레시피 생성",
      contentManagement: "콘텐츠 관리",
      currentSeries: "현재 선택된 시리즈",
      active: "활성",
      generateContent: "콘텐츠 생성",
      ingredients: "재료",
      instructions: "만드는 방법",
      tips: "팁",
      series: {
        "무알콜 하얀술": "무알콜 하얀술",
        "기본 하얀술": "기본 하얀술",
        "쌀알 동동 하얀술": "쌀알 동동 하얀술",
        "이화주 하얀술": "이화주 하얀술",
        "과일 하얀술": "과일 하얀술",
        "허브 하얀술": "허브 하얀술",
        "퓨전 하얀술": "퓨전 하얀술",
      },
    },
    en: {
      title: "Hayansool Content Manager",
      subtitle: "Custom Makgeolli 101 Content Creation & Management",
      content: "Content",
      contentCount: "36 Contents",
      exportContent: "Export Content",
      seriesOverview: "Series Overview",
      seriesDescription: "Hayansool Recipe Series Configuration",
      episode: "Episode",
      recipes: " Recipes",
      selected: "Selected",
      clickToGenerate: "Click to Generate Recipes",
      contentManagement: "Content Management",
      currentSeries: "Currently Selected Series",
      active: "Active",
      generateContent: "Generate Content",
      ingredients: "Ingredients",
      instructions: "Instructions",
      tips: "Tips",
      series: {
        "무알콜 하얀술": "Non-Alcoholic Hayansool",
        "기본 하얀술": "Basic Hayansool",
        "쌀알 동동 하얀술": "Rice Grain Floating Hayansool",
        "이화주 하얀술": "Ihwaju Hayansool",
        "과일 하얀술": "Fruit Hayansool",
        "허브 하얀술": "Herb Hayansool",
        "퓨전 하얀술": "Fusion Hayansool",
      },
    },
    ja: {
      title: "ハヤンスル コンテンツマネージャー",
      subtitle: "カスタムマッコリ101 コンテンツ制作・管理",
      content: "コンテンツ",
      contentCount: "36個のコンテンツ",
      exportContent: "コンテンツエクスポート",
      seriesOverview: "シリーズ概要",
      seriesDescription: "ハヤンスル レシピシリーズ別構成",
      episode: "エピソード",
      recipes: "レシピ",
      selected: "選択済み",
      clickToGenerate: "クリックしてレシピ生成",
      contentManagement: "コンテンツ管理",
      currentSeries: "現在選択されたシリーズ",
      active: "アクティブ",
      generateContent: "コンテンツ生成",
      ingredients: "材料",
      instructions: "作り方",
      tips: "コツ",
      series: {
        "무알콜 하얀술": "ノンアルコール ハヤンスル",
        "기본 하얀술": "ベーシック ハヤンスル",
        "쌀알 동동 하얀술": "米粒浮遊 ハヤンスル",
        "이화주 하얀술": "イファジュ ハヤンスル",
        "과일 하얀술": "フルーツ ハヤンスル",
        "허브 하얀술": "ハーブ ハヤンスル",
        "퓨전 하얀술": "フュージョン ハヤンスル",
      },
    },
    zh: {
      title: "白酒内容管理器",
      subtitle: "定制马格利酒101内容制作与管理",
      content: "内容",
      contentCount: "36个内容",
      exportContent: "导出内容",
      seriesOverview: "系列概览",
      seriesDescription: "白酒食谱系列配置",
      episode: "第",
      recipes: "个食谱",
      selected: "已选择",
      clickToGenerate: "点击生成食谱",
      contentManagement: "内容管理",
      currentSeries: "当前选择的系列",
      active: "活跃",
      generateContent: "生成内容",
      ingredients: "配料",
      instructions: "制作方法",
      tips: "小贴士",
      series: {
        "무알콜 하얀술": "无酒精白酒",
        "기본 하얀술": "基础白酒",
        "쌀알 동동 하얀술": "米粒浮动白酒",
        "이화주 하얀술": "梨花酒白酒",
        "과일 하얀술": "水果白酒",
        "허브 하얀술": "草药白酒",
        "퓨전 하얀술": "融合白酒",
      },
    },
  }

  // Get current translation
  const t = translations[currentLanguage as keyof typeof translations]

  // Updated recipe series with new categories - 퓨전 하얀술 count를 8으로 수정
  const recipeSeries = [
    { id: "1", name: "무알콜 하얀술", episode: 1, count: 1 },
    { id: "2", name: "기본 하얀술", episode: 2, count: 1 },
    { id: "3", name: "쌀알 동동 하얀술", episode: 3, count: 1 },
    { id: "4", name: "이화주 하얀술", episode: 4, count: 1 },
    { id: "5", name: "과일 하얀술", episode: 5, count: 12 },
    { id: "6", name: "허브 하얀술", episode: 6, count: 12 },
    { id: "7", name: "퓨전 하얀술", episode: 7, count: 8 }, // 7에서 8로 수정
  ]

  // Updated sample recipe titles for new categories - 하얀술 뱅쇼 추가
  const sampleTitles = {
    "무알콜 하얀술": ["하얀술 Rice Brewing Mix로 만드는 무알콜 막걸리 - 건강한 선택"],
    "기본 하얀술": ["하얀술 Rice Brewing Mix 한 병으로 만드는 전통 막걸리 - 350ml+150ml 황금비율"],
    "쌀알 동동 하얀술": ["쌀알이 살아있는 하얀술 막걸리 - 식감까지 완벽한 레시피"],
    "이화주 하얀술": ["궁중 이화주 스타일 하얀술 - 고급스러운 전통의 맛"],
    "과일 하얀술": [
      "딸기 하얀술 - 하얀술 Rice Brewing Mix + 딸기즙 150ml로 만드는 달콤한 변화",
      "사과 하얀술 - 350ml+150ml+사과즙 150ml 3단 조화",
      "포도 하얀술 - 하얀술 한 병 + 포도즙 150ml 황금 조합",
      "복숭아 하얀술 - 과일즙 150ml로 여름 맛 완성",
      "오렌지 하얀술 - 상큼한 오렌지로 만드는 비타민 막걸리",
      "오렌지&라임 하얀술 - 시트러스 듀오의 완벽한 조화",
      "참외 하얀술 - 여름 대표 과일로 만드는 시원한 막걸리",
      "감귤 하얀술 - 제주 감귤의 달콤함이 가득한 하얀술",
      "멜론 하얀술 - 고급스러운 멜론 향이 살아있는 막걸리",
      "망고 하얀술 - 열대과일로 만드는 이색 막걸리",
      "블루베리 하얀술 - 안토시아닌 가득한 건강 막걸리",
      "라즈베리 하얀술 - 새콤달콤한 베리의 매력",
    ],
    "허브 하얀술": [
      "바질 하얀술 - 이탈리안 허브로 만드는 이색 막걸리",
      "샐러리 하얀술 - 건강한 채소로 만드는 웰빙 막걸리",
      "깻잎 하얀술 - 한국인의 소울푸드 깻잎으로 만든 막걸리",
      "시소 하얀술 - 일본식 허브 시소의 독특한 향미",
      "라벤더 하얀술 - 프로방스 라벤더로 만드는 힐링 막걸리",
      "로즈마리 하얀술 - 지중해 허브로 만드는 향긋한 막걸리",
      "레몬밤 하얀술 - 상큼한 레몬 향이 살아있는 허브 막걸리",
      "타임 하얀술 - 서양 요리의 대표 허브로 만든 막걸리",
      "히비스커스 하얀술 - 루비빛 꽃차로 만드는 아름다운 막걸리",
      "페퍼민트 하얀술 - 시원한 민트로 만드는 여름 막걸리",
      "카모마일 하얀술 - 편안한 휴식을 주는 꽃차 막걸리",
      "고수 하얀술 - 동남아시아 허브로 만드는 이국적 막걸리",
    ],
    "퓨전 하얀술": [
      "비트 핑크 하얀술 - 천연 핑크빛이 아름다운 비트 막걸리",
      "청양 스파이스 하얀술 - 한국의 매운맛이 살아있는 스파이시 막걸리",
      "트러플 크림 하얀술 - 고급 트러플로 만드는 프리미엄 막걸리",
      "말차 라떼 하얀술 - 일본 말차와 만난 크리미한 막걸리",
      "마살라 시나몬 하얀술 - 인도 향신료로 만드는 스파이스 막걸리",
      "커피 하얀술 - 진한 커피 향이 살아있는 카페인 막걸리",
      "슬러시 하얀술 - 모든 하얀술을 시원한 슬러시로 즐기는 여름 특별 레시피",
      "하얀술 뱅쇼 - 따뜻한 겨울 음료로 즐기는 스파이스 하얀술", // 새로 추가
    ],
  }

  // Get selected series data
  const selectedSeries = recipeSeries.find((s) => s.id === selectedSeriesId)

  // Calculate content counts by language - fixed to 36 (35 + 1)
  const getContentCountByLanguage = (langCode: string) => {
    return 36 // Fixed total content count (35에서 36으로 수정)
  }

  const handleSeriesClick = (seriesId: string) => {
    const seriesData = recipeSeries.find((s) => s.id === seriesId)
    if (!seriesData) return

    const titles = sampleTitles[seriesData.name as keyof typeof sampleTitles] || []
    const newRecipes = titles.map((title, index) => ({
      id: `${seriesId}-${index}`,
      title_ko: title,
      series: seriesData.name,
      episode: seriesData.episode,
      content: {},
    }))

    setRecipes(newRecipes)
    setSelectedSeriesId(seriesId)
    setActiveTab("content")
  }

  const generateContent = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (!recipe) return

    let content = {}

    // 무알콜 하얀술 시리즈인 경우 (새로 추가)
    if (recipe.series === "무알콜 하얀술") {
      content = {
        ko: {
          ingredients: ["하얀술 Rice Brewing Mix 1병", "물 350ml", "물 150ml"],
          instructions: [
            "하얀술 Rice Brewing Mix 한 병을 준비합니다",
            "물 350ml를 먼저 병에 붓습니다",
            "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷! (덩어리 없이 가루를 완전히 풀어줍니다)",
            "나머지 물 150ml를 추가로 붓습니다",
            "다시 한 번 병을 충분히 흔들어줍니다. (미세한 입자까지 풀어지도록)",
            "냉장고에서 최소 2일 이상 숙성시킵니다",
          ],
          tips: "알코올 발효는 일어나지 않으며, 쌀과 누룩의 유산균이 자연스럽게 퍼집니다.",
        },
        en: {
          ingredients: ["1 bottle Hayansool Rice Brewing Mix", "350ml water", "150ml water"],
          instructions: [
            "Prepare 1 bottle of Hayansool Rice Brewing Mix",
            "Pour 350ml water into the bottle first",
            "Close the bottle cap and shake vertically for at least 30 seconds! (Completely dissolve the powder without lumps)",
            "Add the remaining 150ml water",
            "Shake the bottle thoroughly once more (to dissolve even fine particles)",
            "Age in refrigerator for at least 2 days",
          ],
          tips: "No alcohol fermentation occurs, and the lactic acid bacteria from rice and nuruk naturally spread.",
        },
        ja: {
          ingredients: ["ハヤンスル Rice Brewing Mix 1本", "水 350ml", "水 150ml"],
          instructions: [
            "ハヤンスル Rice Brewing Mix 1本を準備します",
            "まず水350mlをボトルに注ぎます",
            "ボトルキャップを閉めて縦に強く30秒以上シェイク！（塊がないよう粉を完全に溶かします）",
            "残りの水150mlを追加で注ぎます",
            "もう一度ボトルを十分に振ります（微細な粒子まで溶けるように）",
            "冷蔵庫で最低2日以上熟成させます",
          ],
          tips: "アルコール発酵は起こらず、米と麹の乳酸菌が自然に広がります。",
        },
        zh: {
          ingredients: ["白酒 Rice Brewing Mix 1瓶", "水 350ml", "水 150ml"],
          instructions: [
            "准备白酒 Rice Brewing Mix 1瓶",
            "先将350ml水倒入瓶中",
            "盖上瓶盖，垂直用力摇晃30秒以上！（完全溶解粉末，不留结块）",
            "再加入剩余的150ml水",
            "再次充分摇晃瓶子（直到微细颗粒也完全溶解）",
            "在冰箱中熟成至少2天以上",
          ],
          tips: "不会发生酒精发酵，米和酒曲中的乳酸菌会自然扩散。",
        },
      }
    }
    // 쌀알 동동 하얀술 시리즈인 경우 (새로 추가)
    else if (recipe.series === "쌀알 동동 하얀술") {
      content = {
        ko: {
          ingredients: ["하얀술 Rice Brewing Mix 1병", "차가운 물 350ml", "물 150ml", "식은 밥 1ts"],
          instructions: [
            "하얀술 Rice Brewing Mix 한 병을 준비합니다",
            "차가운 물 350ml를 먼저 병에 붓습니다",
            "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷! (덩어리 없이 가루를 완전히 풀어줍니다)",
            "나머지 물 150ml를 추가로 붓습니다",
            "다시 한 번 병을 충분히 흔들어줍니다. (미세한 입자까지 풀어지도록)",
            "실온(15~25℃)에서 24시간 발효시킵니다",
            "24시간 후, 뚜껑을 조심스럽게 열고 식은 밥 1ts을 넣은 후 냉장고에 1~2일 숙성시키면 완성!",
          ],
          tips: "식은 밥 1ts은 흰쌀밥 대신, 홍미밥, 녹미밥, 흑미밥, 보리밥, 좁쌀밥, 메밀밥 등을 넣어도 좋습니다. 잔에 따르면 쌀알이 동동 떠서 쌀알 동동 하얀술 입니다.",
        },
        en: {
          ingredients: [
            "1 bottle Hayansool Rice Brewing Mix",
            "350ml cold water",
            "150ml water",
            "1 tsp cooked rice (cooled)",
          ],
          instructions: [
            "Prepare 1 bottle of Hayansool Rice Brewing Mix",
            "Pour 350ml cold water into the bottle first",
            "Close the bottle cap and shake vertically for at least 30 seconds! (Completely dissolve the powder without lumps)",
            "Add the remaining 150ml water",
            "Shake the bottle thoroughly once more (to dissolve even fine particles)",
            "Ferment at room temperature (15~25℃) for 24 hours",
            "After 24 hours, carefully open the lid, add 1 tsp of cooled rice, then age in refrigerator for 1-2 days and it's complete!",
          ],
          tips: "Instead of white rice, you can use red rice, green rice, black rice, barley rice, millet rice, buckwheat rice, etc. for the 1 tsp cooked rice. When poured into a glass, the rice grains float, making it Rice Grain Floating Hayansool.",
        },
        ja: {
          ingredients: ["ハヤンスル Rice Brewing Mix 1本", "冷たい水 350ml", "水 150ml", "冷ましたご飯 1ts"],
          instructions: [
            "ハヤンスル Rice Brewing Mix 1本を準備します",
            "まず冷たい水350mlをボトルに注ぎます",
            "ボトルキャップを閉めて縦に強く30秒以上シェイク！（塊がないよう粉を完全に溶かします）",
            "残りの水150mlを追加で注ぎます",
            "もう一度ボトルを十分に振ります（微細な粒子まで溶けるように）",
            "室温（15~25℃）で24時間発酵させます",
            "24時間後、蓋を慎重に開けて冷ましたご飯1tsを入れ、冷蔵庫で1~2日熟成させれば完成！",
          ],
          tips: "冷ましたご飯1tsは白米の代わりに、赤米、緑米、黒米、麦飯、粟飯、そば飯などを入れても良いです。グラスに注ぐと米粒が浮いて、米粒浮遊ハヤンスルになります。",
        },
        zh: {
          ingredients: ["白酒 Rice Brewing Mix 1瓶", "冷水 350ml", "水 150ml", "放凉的米饭 1ts"],
          instructions: [
            "准备白酒 Rice Brewing Mix 1瓶",
            "先将350ml冷水倒入瓶中",
            "盖上瓶盖，垂直用力摇晃30秒以上！（完全溶解粉末，不留结块）",
            "再加入剩余的150ml水",
            "再次充分摇晃瓶子（直到微细颗粒也完全溶解）",
            "在室温（15~25℃）下发酵24小时",
            "24小时后，小心打开盖子，加入1ts放凉的米饭，然后在冰箱中熟成1-2天即可完成！",
          ],
          tips: "放凉的米饭1ts可以用红米饭、绿米饭、黑米饭、大麦饭、小米饭、荞麦饭等代替白米饭。倒入杯中时米粒会浮起来，这就是米粒浮动白酒。",
        },
      }
    }
    // 허브 하얀술 시리즈인 경우 특별 처리
    else if (recipe.series === "허브 하얀술") {
      const herbName = recipe.title_ko.split(" ")[0] // 첫 번째 단어가 허브명

      content = {
        ko: {
          ingredients: ["하얀술 Rice Brewing Mix 1병", `${herbName} 주스 500ml (미리 준비)`],
          instructions: [
            `${herbName} 주스 500ml를 미리 준비합니다`,
            "하얀술 Rice Brewing Mix 한 병을 준비합니다",
            `준비한 ${herbName} 주스 350ml를 먼저 병에 붓습니다`,
            "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷!",
            `나머지 ${herbName} 주스 150ml를 추가로 붓습니다`,
            "다시 한 번 병을 충분히 흔들어줍니다",
            "실온(15~25℃)에서 24시간 발효시킵니다",
            "24시간 후, 냉장고에 1~2일 숙성시키면 완성!",
          ],
          tips: `${herbName} 주스 500ml를 사용하여 진한 허브 향이 살아있는 막걸리입니다.`,
        },
        en: {
          ingredients: ["1 bottle Hayansool Rice Brewing Mix", `500ml ${herbName} juice (prepare in advance)`],
          instructions: [
            `Prepare 500ml ${herbName} juice in advance`,
            "Prepare 1 bottle of Hayansool Rice Brewing Mix",
            `Pour 350ml of prepared ${herbName} juice into the bottle first`,
            "Close the bottle cap and shake vertically for at least 30 seconds!",
            `Add the remaining 150ml ${herbName} juice`,
            "Shake the bottle thoroughly once more",
            "Ferment at room temperature (15~25℃) for 24 hours",
            "After 24 hours, age in refrigerator for 1-2 days and it's complete!",
          ],
          tips: `Rich herb makgeolli using 500ml ${herbName} juice with intense herb flavor.`,
        },
        ja: {
          ingredients: ["ハヤンスル Rice Brewing Mix 1本", `${herbName}ジュース 500ml（事前に準備）`],
          instructions: [
            `${herbName}ジュース500mlを事前に準備します`,
            "ハヤンスル Rice Brewing Mix 1本を準備します",
            `準備した${herbName}ジュース350mlをまずボトルに注ぎます`,
            "ボトルキャップを閉めて縦に強く30秒以上シェイク！",
            `残りの${herbName}ジュース150mlを追加で注ぎます`,
            "もう一度ボトルを十分に振ります",
            "室温（15~25℃）で24時間発酵させます",
            "24時間後、冷蔵庫で1~2日熟成させれば完成！",
          ],
          tips: `${herbName}ジュース500mlを使用した濃厚なハーブの香りが生きているマッコリです。`,
        },
        zh: {
          ingredients: ["白酒 Rice Brewing Mix 1瓶", `${herbName}汁 500ml（提前准备）`],
          instructions: [
            `提前准备${herbName}汁500ml`,
            "准备白酒 Rice Brewing Mix 1瓶",
            `先将准备好的${herbName}汁350ml倒入瓶中`,
            "盖上瓶盖，垂直用力摇晃30秒以上！",
            `再加入剩余的${herbName}汁150ml`,
            "再次充分摇晃瓶子",
            "在室温（15~25℃）下发酵24小时",
            "24小时后，在冰箱中熟成1-2天即可完成！",
          ],
          tips: `使用500ml${herbName}汁制作的浓郁草药风味马格利酒。`,
        },
      }
    }
    // 이화주 하얀술 시리즈인 경우 (기존 코드를 이 부분으로 교체)
    else if (recipe.series === "이화주 하얀술") {
      content = {
        ko: {
          ingredients: ["하얀술 Rice Brewing Mix 1병", "식은 밥 300g"],
          instructions: [
            "하얀술 Rice Brewing Mix 한 병을 준비합니다",
            "식은 밥 300g을 준비합니다",
            "식은 밥에 하얀술 Rice Brewing Mix 한 병을 붓어 고루 섞어줍니다",
            "실온(15~25℃)에서 72시간 발효시킵니다",
            "믹서나, 원액기, 고운 체로 걸러서 냉장고에 보관하며 즐깁니다",
          ],
          tips: "이화주 하얀술은 요플레처럼 스푼으로 떠 먹는 고체술입니다. 따듯한 물이나 찬 물에 타서 마셔도 좋습니다. 오미자청이나 유자청들과 블랜딩해서 즐겨도 좋습니다.",
        },
        en: {
          ingredients: ["1 bottle Hayansool Rice Brewing Mix", "300g cooked rice (cooled)"],
          instructions: [
            "Prepare 1 bottle of Hayansool Rice Brewing Mix",
            "Prepare 300g of cooled cooked rice",
            "Pour the Hayansool Rice Brewing Mix over the cooled rice and mix well",
            "Ferment at room temperature (15~25℃) for 72 hours",
            "Strain through a blender, juicer, or fine sieve and store in refrigerator to enjoy",
          ],
          tips: "Ihwaju Hayansool is a solid alcohol that you eat with a spoon like yogurt. You can dilute with warm or cold water to drink. It's also great blended with omija syrup or yuzu syrup.",
        },
        ja: {
          ingredients: ["ハヤンスル Rice Brewing Mix 1本", "冷ましたご飯 300g"],
          instructions: [
            "ハヤンスル Rice Brewing Mix 1本を準備します",
            "冷ましたご飯300gを準備します",
            "冷ましたご飯にハヤンスル Rice Brewing Mix 1本を注いでよく混ぜます",
            "室温（15~25℃）で72時間発酵させます",
            "ミキサーや原液機、細かい網で濾して冷蔵庫で保管してお楽しみください",
          ],
          tips: "イファジュ ハヤンスルはヨーグルトのようにスプーンですくって食べる固体酒です。温かい水や冷たい水で割って飲んでも良いです。オミジャシロップやユズシロップとブレンドして楽しむのもおすすめです。",
        },
        zh: {
          ingredients: ["白酒 Rice Brewing Mix 1瓶", "放凉的米饭 300g"],
          instructions: [
            "准备白酒 Rice Brewing Mix 1瓶",
            "准备放凉的米饭300g",
            "将白酒 Rice Brewing Mix倒入放凉的米饭中，充分搅拌均匀",
            "在室温（15~25℃）下发酵72小时",
            "用搅拌机、原汁机或细筛过滤后放入冰箱保存享用",
          ],
          tips: "梨花酒白酒是像酸奶一样用勺子舀着吃的固体酒。可以用温水或冷水稀释饮用。也可以与五味子糖浆或柚子糖浆混合享用。",
        },
      }
    }
    // 과일 하얀술 시리즈인 경우
    else if (recipe.series === "과일 하얀술") {
      const fruitName = recipe.title_ko.split(" ")[0] // 첫 번째 단어가 과일명

      content = {
        ko: {
          ingredients: ["하얀술 Rice Brewing Mix 1병", `${fruitName} 주스 500ml (미리 준비)`],
          instructions: [
            `${fruitName} 주스 500ml를 미리 준비합니다`,
            "하얀술 Rice Brewing Mix 한 병을 준비합니다",
            `준비한 ${fruitName} 주스 350ml를 먼저 병에 붓습니다`,
            "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷!",
            `나머지 ${fruitName} 주스 150ml를 추가로 붓습니다`,
            "다시 한 번 병을 충분히 흔들어줍니다",
            "실온(15~25℃)에서 24시간 발효시킵니다",
            "24시간 후, 냉장고에 1~2일 숙성시키면 완성!",
          ],
          tips: `${fruitName} 주스 500ml를 사용하여 진한 과일 맛이 살아있는 막걸리입니다.`,
        },
        en: {
          ingredients: ["1 bottle Hayansool Rice Brewing Mix", `500ml ${fruitName} juice (prepare in advance)`],
          instructions: [
            `Prepare 500ml ${fruitName} juice in advance`,
            "Prepare 1 bottle of Hayansool Rice Brewing Mix",
            `Pour 350ml of prepared ${fruitName} juice into the bottle first`,
            "Close the bottle cap and shake vertically for at least 30 seconds!",
            `Add the remaining 150ml ${fruitName} juice`,
            "Shake the bottle thoroughly once more",
            "Ferment at room temperature (15~25℃) for 24 hours",
            "After 24 hours, age in refrigerator for 1-2 days and it's complete!",
          ],
          tips: `Rich fruit makgeolli using 500ml ${fruitName} juice with intense fruit flavor.`,
        },
        ja: {
          ingredients: ["ハヤンスル Rice Brewing Mix 1本", `${fruitName}ジュース 500ml（事前に準備）`],
          instructions: [
            `${fruitName}ジュース500mlを事前に準備します`,
            "ハヤンスル Rice Brewing Mix 1本を準備します",
            `準備した${fruitName}ジュース350mlをまずボトルに注ぎます`,
            "ボトルキャップを閉めて縦に強く30秒以上シェイク！",
            `残りの${fruitName}ジュース150mlを追加で注ぎます`,
            "もう一度ボトルを十分に振ります",
            "室温（15~25℃）で24時間発酵させます",
            "24時間後、冷蔵庫で1~2日熟成させれば完成！",
          ],
          tips: `${fruitName}ジュース500mlを使用した濃厚な果物の味が生きているマッコリです。`,
        },
        zh: {
          ingredients: ["白酒 Rice Brewing Mix 1瓶", `${fruitName}汁 500ml（提前准备）`],
          instructions: [
            `提前准备${fruitName}汁500ml`,
            "准备白酒 Rice Brewing Mix 1瓶",
            `先将准备好的${fruitName}汁350ml倒入瓶中`,
            "盖上瓶盖，垂直用力摇晃30秒以上！",
            `再加入剩余的${fruitName}汁150ml`,
            "再次充分摇晃瓶子",
            "在室温（15~25℃）下发酵24小时",
            "24小时后，在冰箱中熟成1-2天即可完成！",
          ],
          tips: `使用500ml${fruitName}汁制作的浓郁水果风味马格利酒。`,
        },
      }
    }
    // 퓨전 하얀술 시리즈인 경우 - 커피, 슬러시, 하얀술 뱅쇼 특별 처리 추가
    else if (recipe.series === "퓨전 하얀술") {
      const fusionName = recipe.title_ko.split(" ")[0] // 첫 번째 단어가 재료명

      // 커피 하얀술인 경우 특별 처리
      if (fusionName === "커피") {
        content = {
          ko: {
            ingredients: ["하얀술 Rice Brewing Mix 1병", "커피 500ml (미리 준비)"],
            instructions: [
              "커피 500ml를 미리 준비합니다",
              "하얀술 Rice Brewing Mix 한 병을 준비합니다",
              "준비한 커피 350ml를 먼저 병에 붓습니다",
              "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷!",
              "나머지 커피 150ml를 추가로 붓습니다",
              "다시 한 번 병을 충분히 흔들어줍니다",
              "실온(15~25℃)에서 24시간 발효시킵니다",
              "24시간 후, 냉장고에 1~2일 숙성시키면 완성!",
            ],
            tips: "커피 500ml를 사용하여 진한 커피 향과 카페인이 살아있는 독특한 막걸리입니다.",
          },
          en: {
            ingredients: ["1 bottle Hayansool Rice Brewing Mix", "500ml coffee (prepare in advance)"],
            instructions: [
              "Prepare 500ml coffee in advance",
              "Prepare 1 bottle of Hayansool Rice Brewing Mix",
              "Pour 350ml of prepared coffee into the bottle first",
              "Close the bottle cap and shake vertically for at least 30 seconds!",
              "Add the remaining 150ml coffee",
              "Shake the bottle thoroughly once more",
              "Ferment at room temperature (15~25℃) for 24 hours",
              "After 24 hours, age in refrigerator for 1-2 days and it's complete!",
            ],
            tips: "Unique makgeolli using 500ml coffee with rich coffee aroma and caffeine.",
          },
          ja: {
            ingredients: ["ハヤンスル Rice Brewing Mix 1本", "コーヒー 500ml（事前に準備）"],
            instructions: [
              "コーヒー500mlを事前に準備します",
              "ハヤンスル Rice Brewing Mix 1本を準備します",
              "準備したコーヒー350mlをまずボトルに注ぎます",
              "ボトルキャップを閉めて縦に強く30秒以上シェイク！",
              "残りのコーヒー150mlを追加で注ぎます",
              "もう一度ボトルを十分に振ります",
              "室温（15~25℃）で24時間発酵させます",
              "24時間後、冷蔵庫で1~2日熟成させれば完成！",
            ],
            tips: "コーヒー500mlを使用した濃厚なコーヒーの香りとカフェインが生きている独特なマッコリです。",
          },
          zh: {
            ingredients: ["白酒 Rice Brewing Mix 1瓶", "咖啡 500ml（提前准备）"],
            instructions: [
              "提前准备咖啡500ml",
              "准备白酒 Rice Brewing Mix 1瓶",
              "先将准备好的咖啡350ml倒入瓶中",
              "盖上瓶盖，垂直用力摇晃30秒以上！",
              "再加入剩余的咖啡150ml",
              "再次充分摇晃瓶子",
              "在室温（15~25℃）下发酵24小时",
              "24小时后，在冰箱中熟成1-2天即可完成！",
            ],
            tips: "使用500ml咖啡制作的浓郁咖啡香味和咖啡因的独特马格利酒。",
          },
        }
      }
      // 슬러시 하얀술인 경우 특별 처리
      else if (fusionName === "슬러시") {
        content = {
          ko: {
            ingredients: [
              "완성된 하얀술 (무알콜~퓨전 하얀술 중 아무거나) 500ml",
              "얼음 200g",
              "슬러시 메이커 또는 믹서기",
            ],
            instructions: [
              "무알콜 하얀술부터 퓨전 하얀술까지 원하는 하얀술을 선택합니다",
              "선택한 하얀술 500ml를 준비합니다",
              "얼음 200g을 준비합니다",
              "슬러시 메이커에 완성된 하얀술 500ml를 붓습니다",
              "얼음 200g을 추가합니다",
              "슬러시 메이커를 작동시켜 시원한 슬러시로 만듭니다",
              "잔에 담아 즉시 서빙합니다",
            ],
            tips: "모든 종류의 하얀술을 슬러시로 즐길 수 있는 여름 특별 레시피입니다. 과일 하얀술이나 허브 하얀술로 만들면 더욱 상큼하고 시원합니다.",
          },
          en: {
            ingredients: [
              "500ml completed Hayansool (any from non-alcoholic to fusion)",
              "200g ice",
              "Slush maker or blender",
            ],
            instructions: [
              "Choose any Hayansool from non-alcoholic to fusion varieties",
              "Prepare 500ml of your chosen Hayansool",
              "Prepare 200g of ice",
              "Pour 500ml of completed Hayansool into the slush maker",
              "Add 200g of ice",
              "Operate the slush maker to create a refreshing slush",
              "Serve immediately in glasses",
            ],
            tips: "A special summer recipe that allows you to enjoy all types of Hayansool as slush. Fruit or herb Hayansool varieties make it even more refreshing and cool.",
          },
          ja: {
            ingredients: [
              "完成したハヤンスル（ノンアルコール〜フュージョンまで何でも）500ml",
              "氷 200g",
              "スラッシュメーカーまたはミキサー",
            ],
            instructions: [
              "ノンアルコールハヤンスルからフュージョンハヤンスルまでお好みのハヤンスルを選びます",
              "選んだハヤンスル500mlを準備します",
              "氷200gを準備します",
              "スラッシュメーカーに完成したハヤンスル500mlを注ぎます",
              "氷200gを追加します",
              "スラッシュメーカーを作動させて爽やかなスラッシュを作ります",
              "グラスに入れてすぐにサーブします",
            ],
            tips: "すべての種類のハヤンスルをスラッシュで楽しめる夏の特別レシピです。フルーツハヤンスルやハーブハヤンスルで作るとより爽やかで涼しくなります。",
          },
          zh: {
            ingredients: ["完成的白酒（无酒精到融合白酒任选）500ml", "冰块 200g", "刨冰机或搅拌机"],
            instructions: [
              "从无酒精白酒到融合白酒中选择您喜欢的白酒",
              "准备选择的白酒500ml",
              "准备冰块200g",
              "将完成的白酒500ml倒入刨冰机中",
              "加入冰块200g",
              "启动刨冰机制作清爽的刨冰",
              "装入杯中立即享用",
            ],
            tips: "可以将所有类型的白酒制作成刨冰享用的夏季特别食谱。用水果白酒或草药白酒制作会更加清爽凉快。",
          },
        }
      }
      // 하얀술 뱅쇼인 경우 특별 처리
      else if (fusionName === "하얀술") {
        content = {
          ko: {
            ingredients: [
              "무알콜 하얀술 또는 기본 하얀술 1병",
              "대추 1알",
              "생강 1톨",
              "계피 1조각",
              "흑설탕 1Ts",
              "사과, 오렌지 등 과일 (취향에 따라)",
            ],
            instructions: [
              "무알콜 하얀술 또는 기본 하얀술 1병을 준비합니다",
              "대추 1알, 생강 1톨, 계피 1조각, 흑설탕 1Ts을 준비합니다",
              "냄비에 하얀술 1병과 모든 재료를 넣습니다",
              "센불에서 끓자마자 약불로 줄입니다",
              "약불에서 30분간 끓입니다",
              "따뜻하게 잔에 따라 즐깁니다",
              "풍미를 원하면 원하는 과일을 넣어 다양한 풍미를 만들 수 있습니다",
            ],
            tips: "겨울 음료로 추천합니다. 따뜻하게 마시면 몸이 따뜻해지고 향신료의 풍미가 살아납니다.",
          },
          en: {
            ingredients: [
              "1 bottle non-alcoholic Hayansool or basic Hayansool",
              "1 jujube",
              "1 piece ginger",
              "1 piece cinnamon",
              "1 Ts brown sugar",
              "Fruits like apple, orange (optional)",
            ],
            instructions: [
              "Prepare 1 bottle of non-alcoholic Hayansool or basic Hayansool",
              "Prepare 1 jujube, 1 piece ginger, 1 piece cinnamon, 1 Ts brown sugar",
              "Put Hayansool and all ingredients in a pot",
              "Reduce to low heat as soon as it boils on high heat",
              "Simmer on low heat for 30 minutes",
              "Serve warm in glasses",
              "Add desired fruits for various flavors if you want more taste",
            ],
            tips: "Recommended as a winter drink. Drinking it warm warms the body and brings out the flavor of the spices.",
          },
          ja: {
            ingredients: [
              "ノンアルコールハヤンスルまたはベーシックハヤンスル 1本",
              "なつめ 1個",
              "生姜 1片",
              "シナモン 1片",
              "黒砂糖 1Ts",
              "りんご、オレンジなどの果物（お好みで）",
            ],
            instructions: [
              "ノンアルコールハヤンスルまたはベーシックハヤンスル1本を準備します",
              "なつめ1個、生姜1片、シナモン1片、黒砂糖1Tsを準備します",
              "鍋にハヤンスル1本とすべての材料を入れます",
              "強火で沸騰したらすぐに弱火にします",
              "弱火で30分間煮込みます",
              "温かいうちにグラスに注いで楽しみます",
              "風味をお望みなら、お好みの果物を入れて様々な風味を作ることができます",
            ],
            tips: "冬の飲み物としておすすめです。温かく飲むと体が温まり、スパイスの風味が生きてきます。",
          },
          zh: {
            ingredients: [
              "无酒精白酒或基础白酒 1瓶",
              "大枣 1个",
              "生姜 1片",
              "肉桂 1片",
              "红糖 1Ts",
              "苹果、橙子等水果（根据喜好）",
            ],
            instructions: [
              "准备无酒精白酒或基础白酒1瓶",
              "准备大枣1个、生姜1片、肉桂1片、红糖1Ts",
              "在锅中放入白酒1瓶和所有材料",
              "大火煮开后立即转小火",
              "小火煮30分钟",
              "趁热倒入杯中享用",
              "如果想要更多风味，可以加入喜欢的水果制作各种口味",
            ],
            tips: "推荐作为冬季饮品。热饮可以暖身，香料的风味会更加突出。",
          },
        }
      } else {
        // 다른 퓨전 하얀술들
        content = {
          ko: {
            ingredients: ["하얀술 Rice Brewing Mix 1병", `${fusionName} 주스 500ml (미리 준비)`],
            instructions: [
              `${fusionName} 주스 500ml를 미리 준비합니다`,
              "하얀술 Rice Brewing Mix 한 병을 준비합니다",
              `준비한 ${fusionName} 주스 350ml를 먼저 병에 붓습니다`,
              "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷!",
              `나머지 ${fusionName} 주스 150ml를 추가로 붓습니다`,
              "다시 한 번 병을 충분히 흔들어줍니다",
              "실온(15~25℃)에서 24시간 발효시킵니다",
              "24시간 후, 냉장고에 1~2일 숙성시키면 완성!",
            ],
            tips: `${fusionName} 주스 500ml를 사용하여 독특한 퓨전 맛이 살아있는 막걸리입니다.`,
          },
          en: {
            ingredients: ["1 bottle Hayansool Rice Brewing Mix", `500ml ${fusionName} juice (prepare in advance)`],
            instructions: [
              `Prepare 500ml ${fusionName} juice in advance`,
              "Prepare 1 bottle of Hayansool Rice Brewing Mix",
              `Pour 350ml of prepared ${fusionName} juice into the bottle first`,
              "Close the bottle cap and shake vertically for at least 30 seconds!",
              `Add the remaining 150ml ${fusionName} juice`,
              "Shake the bottle thoroughly once more",
              "Ferment at room temperature (15~25℃) for 24 hours",
              "After 24 hours, age in refrigerator for 1-2 days and it's complete!",
            ],
            tips: `Unique fusion makgeolli using 500ml ${fusionName} juice with distinctive fusion flavor.`,
          },
          ja: {
            ingredients: ["ハヤンスル Rice Brewing Mix 1本", `${fusionName}ジュース 500ml（事前に準備）`],
            instructions: [
              `${fusionName}ジュース500mlを事前に準備します`,
              "ハヤンスル Rice Brewing Mix 1本を準備します",
              `準備した${fusionName}ジュース350mlをまずボトルに注ぎます`,
              "ボトルキャップを閉めて縦に強く30秒以上シェイク！",
              `残りの${fusionName}ジュース150mlを追加で注ぎます`,
              "もう一度ボトルを十分に振ります",
              "室温（15~25℃）で24時間発酵させます",
              "24時間後、冷蔵庫で1~2日熟成させれば完成！",
            ],
            tips: `${fusionName}ジュース500mlを使用した独特なフュージョンの味が生きているマッコリです。`,
          },
          zh: {
            ingredients: ["白酒 Rice Brewing Mix 1瓶", `${fusionName}汁 500ml（提前准备）`],
            instructions: [
              `提前准备${fusionName}汁500ml`,
              "准备白酒 Rice Brewing Mix 1瓶",
              `先将准备好的${fusionName}汁350ml倒入瓶中`,
              "盖上瓶盖，垂直用力摇晃30秒以上！",
              `再加入剩余的${fusionName}汁150ml`,
              "再次充分摇晃瓶子",
              "在室温（15~25℃）下发酵24小时",
              "24小时后，在冰箱中熟成1-2天即可完成！",
            ],
            tips: `使用500ml${fusionName}汁制作的独特融合风味马格利酒。`,
          },
        }
      }
    }
    // 기본 레시피 (다른 시리즈들)
    else {
      content = {
        ko: {
          ingredients: ["하얀술 Rice Brewing Mix 1병", "차가운 물 350ml", "물 150ml"],
          instructions: [
            "하얀술 Rice Brewing Mix 한 병을 준비합니다",
            "차가운 물 350ml를 먼저 병에 붓습니다",
            "병 뚜껑을 닫고 세로로 강하게 30초 이상 쉐킷!",
            "나머지 물 150ml를 추가로 붓습니다",
            "다시 한 번 병을 충분히 흔들어줍니다",
            "실온(15~25℃)에서 24시간 발효시킵니다",
            "24시간 후, 냉장고에 1~2일 숙성시키면 완성!",
          ],
          tips: "기본 레시피입니다.",
        },
        en: {
          ingredients: ["1 bottle Hayansool Rice Brewing Mix", "350ml cold water", "150ml water"],
          instructions: [
            "Prepare 1 bottle of Hayansool Rice Brewing Mix",
            "Pour 350ml cold water into the bottle first",
            "Close the bottle cap and shake vertically for at least 30 seconds!",
            "Add the remaining 150ml water",
            "Shake the bottle thoroughly once more",
            "Ferment at room temperature (15~25℃) for 24 hours",
            "After 24 hours, age in refrigerator for 1-2 days and it's complete!",
          ],
          tips: "This is the basic recipe.",
        },
        ja: {
          ingredients: ["ハヤンスル Rice Brewing Mix 1本", "冷たい水 350ml", "水 150ml"],
          instructions: [
            "ハヤンスル Rice Brewing Mix 1本を準備します",
            "まず冷たい水350mlをボトルに注ぎます",
            "ボトルキャップを閉めて縦に強く30秒以上シェイク！",
            "残りの水150mlを追加で注ぎます",
            "もう一度ボトルを十分に振ります",
            "室温（15~25℃）で24時間発酵させます",
            "24時間後、冷蔵庫で1~2日熟成させれば完成！",
          ],
          tips: "これは基本レシピです。",
        },
        zh: {
          ingredients: ["白酒 Rice Brewing Mix 1瓶", "冷水 350ml", "水 150ml"],
          instructions: [
            "准备白酒 Rice Brewing Mix 1瓶",
            "先将350ml冷水倒入瓶中",
            "盖上瓶盖，垂直用力摇晃30秒以上！",
            "再加入剩余的150ml水",
            "再次充分摇晃瓶子",
            "在室温（15~25℃）下发酵24小时",
            "24小时后，在冰箱中熟成1-2天即可完成！",
          ],
          tips: "这是基本食谱。",
        },
      }
    }

    setRecipes((prevRecipes) => prevRecipes.map((r) => (r.id === recipeId ? { ...r, content } : r)))
  }

  // 언어별 콘텐츠 카드 클릭 핸들러 추가
  const handleLanguageCardClick = (langCode: string) => {
    setCurrentLanguage(langCode)
    // 시리즈가 선택되어 있다면 콘텐츠 탭으로, 아니면 시리즈 개요 유지
    if (selectedSeriesId) {
      setActiveTab("content")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto p-6">
        {/* Header with Language Selector */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 mb-2">{t.title}</h1>
              <p className="text-amber-700">{t.subtitle}</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={currentLanguage === lang.code ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentLanguage(lang.code)}
                    className={`${
                      currentLanguage === lang.code
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "border-amber-300 text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Language Content Counts and Export - 36개로 수정 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Language-specific content counts */}
          {languages.map((lang) => (
            <Card
              key={lang.code}
              className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
              onClick={() => handleLanguageCardClick(lang.code)}
            >
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{lang.flag}</div>
                  <div>
                    <p className="text-sm font-medium text-green-800">{lang.name}</p>
                    <p className="text-2xl font-bold text-green-900">36</p>
                    <p className="text-xs text-green-600">
                      {lang.code === "ko" && "36개 콘텐츠"}
                      {lang.code === "en" && "36 Contents"}
                      {lang.code === "ja" && "36個のコンテンツ"}
                      {lang.code === "zh" && "36个内容"}
                    </p>
                    <p className="text-xs text-green-500 mt-1 font-medium">
                      {currentLanguage === lang.code ? "✓ 선택됨" : "클릭하여 선택"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-orange-800 mb-2">{t.exportContent}</p>
                  <Button
                    onClick={() => {
                      const dataStr = JSON.stringify(recipes, null, 2)
                      const dataBlob = new Blob([dataStr], { type: "application/json" })
                      const url = URL.createObjectURL(dataBlob)
                      const link = document.createElement("a")
                      link.href = url
                      link.download = `hayansool-recipes-${new Date().toISOString().split("T")[0]}.json`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                      URL.revokeObjectURL(url)
                    }}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Series Overview - Version 21 Style */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-amber-800">{t.seriesOverview}</CardTitle>
            <CardDescription>{t.seriesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recipeSeries.map((series) => (
                <div
                  key={series.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    selectedSeriesId === series.id
                      ? "bg-amber-200 border-amber-400 shadow-md"
                      : "bg-amber-50 border-transparent hover:bg-amber-100 hover:border-amber-300"
                  }`}
                  onClick={() => handleSeriesClick(series.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-amber-900 text-lg">
                      {t.series[series.name as keyof typeof t.series]}
                    </h4>
                    {selectedSeriesId === series.id && <CheckCircle className="w-5 h-5 text-amber-600" />}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700 font-medium">
                        {t.episode} {series.episode}
                      </span>
                      <Badge variant="secondary" className="bg-amber-200 text-amber-800">
                        {series.count}
                        {t.recipes}
                      </Badge>
                    </div>

                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(series.count / 12) * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-amber-600 mt-2">
                      {selectedSeriesId === series.id ? (
                        <span className="font-medium text-amber-700">✓ {t.selected}</span>
                      ) : (
                        t.clickToGenerate
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs - Only show when series is selected */}
        {selectedSeries && recipes.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 bg-amber-100">
              <TabsTrigger value="content" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                {t.contentManagement}
              </TabsTrigger>
            </TabsList>

            {/* Content Management Tab */}
            <TabsContent value="content">
              <div className="space-y-4">
                {/* Selected Series Info */}
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-amber-900">
                          {t.currentSeries}: {t.series[selectedSeries.name as keyof typeof t.series]}
                        </h3>
                        <p className="text-sm text-amber-700">
                          {t.episode} {selectedSeries.episode} • {recipes.length}
                          {t.recipes}
                        </p>
                      </div>
                      <Badge className="bg-amber-600 text-white">{t.active}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Recipe Cards */}
                {recipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{recipe.title_ko}</CardTitle>
                      <Badge variant="secondary">
                        Ep.{recipe.episode} - {t.series[recipe.series as keyof typeof t.series]}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-4">
                        <Button
                          onClick={() => generateContent(recipe.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {t.generateContent}
                        </Button>
                      </div>

                      {Object.keys(recipe.content || {}).length > 0 && (
                        <Tabs value={activeLanguageTab} onValueChange={setActiveLanguageTab} className="space-y-4">
                          <TabsList>
                            {languages.map((lang) => (
                              <TabsTrigger key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {languages.map((lang) => (
                            <TabsContent key={lang.code} value={lang.code}>
                              {recipe.content[lang.code] && (
                                <div className="space-y-4">
                                  <div>
                                    <Label>{t.ingredients}</Label>
                                    <Textarea
                                      value={recipe.content[lang.code].ingredients?.join("\n") || ""}
                                      readOnly
                                      rows={3}
                                    />
                                  </div>
                                  <div>
                                    <Label>{t.instructions}</Label>
                                    <Textarea
                                      value={recipe.content[lang.code].instructions?.join("\n") || ""}
                                      readOnly
                                      rows={4}
                                    />
                                  </div>
                                  <div>
                                    <Label>{t.tips}</Label>
                                    <Textarea value={recipe.content[lang.code].tips || ""} readOnly rows={2} />
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          ))}
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
