-- Create tables for the Makgeolli content management system

-- Recipe series/themes
CREATE TABLE recipe_series (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  episode_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated recipe titles
CREATE TABLE recipe_titles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID REFERENCES recipe_series(id) ON DELETE CASCADE,
  title_ko VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  title_ja VARCHAR(500),
  title_zh VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multilingual content for each recipe
CREATE TABLE recipe_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id UUID REFERENCES recipe_titles(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL, -- 'ko', 'en', 'ja', 'zh'
  content TEXT NOT NULL,
  ingredients TEXT[],
  instructions TEXT[],
  tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content
CREATE TABLE generated_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id UUID REFERENCES recipe_titles(id) ON DELETE CASCADE,
  content_ko TEXT NOT NULL,
  content_en TEXT,
  content_ja TEXT,
  content_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rendered card images
CREATE TABLE recipe_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id UUID REFERENCES recipe_titles(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL,
  image_url TEXT,
  image_blob_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content scheduling
CREATE TABLE content_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES generated_content(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  platform VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample series
INSERT INTO recipe_series (name, description, episode_number) VALUES
('무알콜 하얀술', '알코올 없이 즐기는 건강한 막걸리', 1),
('기본 하얀술', '전통적인 막걸리 제조법', 1),
('쌀알 동동 하얀술', '쌀알이 살아있는 특별한 막걸리', 1),
('이화주 하얀술', '고급스러운 전통 이화주 스타일', 1),
('과일 하얀술', '신선한 과일을 활용한 막걸리', 12),
('허브 하얀술', '향긋한 허브가 들어간 막걸리', 12),
('퓨전 하얀술', '현대적 감각의 창의적 막걸리', 8);
