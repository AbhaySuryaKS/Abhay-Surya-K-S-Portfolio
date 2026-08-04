CREATE TABLE skill_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE project_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE certificate_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE profile (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    greeting VARCHAR(255) DEFAULT 'Hello, I''m',
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    bio TEXT,
    availability VARCHAR(255) DEFAULT 'Available For Internship',
    profile_image TEXT,
    resume_pdf TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stats (
    id SERIAL PRIMARY KEY,
    value VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    value TEXT NOT NULL,
    icon_svg TEXT
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_svg TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skill_category_junction (
    skill_id INT NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES skill_category (id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, category_id)
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    image TEXT,
    github_url TEXT,
    live_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_category_junction (
    project_id INT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES project_category (id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    issued_by VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    credential_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_category_junction (
    certificate_id INT NOT NULL REFERENCES certificate (id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES certificate_category (id) ON DELETE CASCADE,
    PRIMARY KEY (certificate_id, category_id)
);

CREATE TABLE stack (
    project_id INT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);