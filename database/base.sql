CREATE TABLE EARLY_ACCESS_USERS (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT,
  email TEXT NOT NULL,
  phone_number TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE brands (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE brand_memberships (
  user_id UUID REFERENCES users(id),
  brand_id UUID REFERENCES brands(id),
  PRIMARY KEY (user_id, brand_id)
);

CREATE TABLE permissions (
  name TEXT PRIMARY KEY
);


-- Sample permissions
INSERT INTO permissions (name) VALUES
('page:dashboard:view'),
('page:billing:view'),
('api:analytics:read'),
('api:analytics:write'),
('brand:members:manage'),
('brand:settings:configure');

CREATE TYPE permission_effect AS ENUM ('allow', 'deny');

CREATE TABLE user_brand_permissions (
  user_id UUID NOT NULL,
  brand_id UUID NULL,
  permission TEXT NOT NULL,
  effect permission_effect NOT NULL,
  created_at TIMESTAMP DEFAULT now(),

  PRIMARY KEY (user_id, permission, brand_id)
);

CREATE TABLE user_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),

  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,

  raw_profile JSONB,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  deleted_at TIMESTAMPTZ NULL,

  UNIQUE(provider, provider_user_id)
);


CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    question TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code CHAR(2) PRIMARY KEY,          -- ISO 3166-1 alpha-2
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),  -- optional like CA, NY

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP,

    UNIQUE(country_id, name)
);

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,

    name VARCHAR(150) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP,

    UNIQUE(state_id, name)
);

CREATE INDEX idx_states_country ON states(country_id);
CREATE INDEX idx_cities_state ON cities(state_id);

CREATE TYPE location_level AS ENUM (
    'COUNTRY',
    'STATE',
    'CITY'
);

CREATE TABLE personas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    location_level location_level NOT NULL,
    location_id UUID NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP
);
CREATE INDEX idx_personas_location ON personas(location_id);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE prompt_personas (
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP,

    PRIMARY KEY (prompt_id, persona_id)
);

CREATE TABLE prompt_tags (
    prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP,

    PRIMARY KEY (prompt_id, tag_id)
);

CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    action_type VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    rationale TEXT,

    user_id VARCHAR(255),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_prompts_status ON prompts(status);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_personas_title ON personas(title);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);