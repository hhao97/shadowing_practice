-- =====================================================
-- Better Auth 数据库迁移脚本
-- =====================================================
-- 此脚本将：
-- 1. 删除旧的表结构（使用蛇形命名）
-- 2. 创建新的 Better Auth 标准表结构（使用驼峰命名）
-- =====================================================

-- 步骤 1: 删除旧表（如果存在）
DROP TABLE IF EXISTS "verification" CASCADE;
DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- 步骤 2: 创建新的 Better Auth 标准表结构

-- 用户表
create table "user" (
    "id" text not null primary key,
    "name" text not null,
    "email" text not null unique,
    "emailVerified" boolean not null,
    "image" text,
    "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);

-- 会话表
create table "session" (
    "id" text not null primary key,
    "expiresAt" timestamptz not null,
    "token" text not null unique,
    "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamptz not null,
    "ipAddress" text,
    "userAgent" text,
    "userId" text not null references "user" ("id") on delete cascade
);

-- 账户表（用于密码认证和OAuth）
create table "account" (
    "id" text not null primary key,
    "accountId" text not null,
    "providerId" text not null,
    "userId" text not null references "user" ("id") on delete cascade,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamptz,
    "refreshTokenExpiresAt" timestamptz,
    "scope" text,
    "password" text,
    "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamptz not null
);

-- 验证表（用于邮箱验证、密码重置等）
create table "verification" (
    "id" text not null primary key,
    "identifier" text not null,
    "value" text not null,
    "expiresAt" timestamptz not null,
    "createdAt" timestamptz default CURRENT_TIMESTAMP not null,
    "updatedAt" timestamptz default CURRENT_TIMESTAMP not null
);

-- 步骤 3: 创建索引以提升查询性能
create index "session_userId_idx" on "session" ("userId");
create index "account_userId_idx" on "account" ("userId");
create index "verification_identifier_idx" on "verification" ("identifier");

-- =====================================================
-- 完成！
-- =====================================================
-- 表结构已更新为 Better Auth 标准格式（驼峰命名）
-- 现在可以正常使用 Better Auth 进行用户认证
-- =====================================================
