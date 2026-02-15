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
  deleted_at TIMESTAMPTZ NULL,

  UNIQUE(provider, provider_user_id)
);
