
-- Create Mind Maps Table (Projects)
CREATE TABLE IF NOT EXISTS mind_maps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Sem Título',
  thumbnail_url text,
  is_favorite boolean DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Nodes Table
CREATE TABLE IF NOT EXISTS mind_map_nodes (
  id text NOT NULL, -- ReactFlow uses string IDs, keeping it flexible
  map_id uuid REFERENCES mind_maps(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'default', -- 'default', 'input', 'output', 'sticky', 'shape'
  position_x numeric NOT NULL,
  position_y numeric NOT NULL,
  data jsonb DEFAULT '{}'::jsonb, -- Stores label, color, specifics
  width numeric,
  height numeric,
  selected boolean DEFAULT false,
  drag_handle text,
  parent_id text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id, map_id) -- Composite key might be tricky with ReactFlow IDs, but necessary for data integrity
);

-- Create Edges Table (Connections)
CREATE TABLE IF NOT EXISTS mind_map_edges (
  id text NOT NULL,
  map_id uuid REFERENCES mind_maps(id) ON DELETE CASCADE,
  source text NOT NULL,
  target text NOT NULL,
  source_handle text,
  target_handle text,
  type text DEFAULT 'default', -- 'default', 'step', 'smoothstep', 'straight'
  animated boolean DEFAULT false,
  label text,
  style jsonb DEFAULT '{}'::jsonb, -- storage for stroke color, width
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id, map_id)
);

-- RLS Policies
ALTER TABLE mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_map_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mind_map_edges ENABLE ROW LEVEL SECURITY;

-- Mind Maps Policies
CREATE POLICY "Users can view their own maps" ON mind_maps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own maps" ON mind_maps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maps" ON mind_maps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maps" ON mind_maps
  FOR DELETE USING (auth.uid() = user_id);

-- Nodes Policies (Inherit access via map_id check would be expensive, so we check existence)
-- Simplified for performance: Assumes if you have access to the map (via application logic), you can edit nodes.
-- But for strict security:
CREATE POLICY "Users can view nodes of their maps" ON mind_map_nodes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_nodes.map_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert nodes to their maps" ON mind_map_nodes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_nodes.map_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update nodes of their maps" ON mind_map_nodes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_nodes.map_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete nodes of their maps" ON mind_map_nodes
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_nodes.map_id AND user_id = auth.uid())
  );

-- Edges Policies (Same logic)
CREATE POLICY "Users can view edges of their maps" ON mind_map_edges
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_edges.map_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert edges to their maps" ON mind_map_edges
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_edges.map_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update edges of their maps" ON mind_map_edges
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_edges.map_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can delete edges of their maps" ON mind_map_edges
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM mind_maps WHERE id = mind_map_edges.map_id AND user_id = auth.uid())
  );
