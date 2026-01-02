#!/bin/bash
###
 # @Author: shasha0102 970284297@qq.com
 # @Date: 2025-12-27 23:01:27
 # @LastEditors: shasha0102 970284297@qq.com
 # @LastEditTime: 2025-12-27 23:36:47
 # @FilePath: /koa/ai-nest/build-lambda.sh
 # @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
### 

if [ -z "$1" ]; then
    echo "❌ Environment parameter is required! Please use: ./build.sh [development|production|test]"
    exit 1
fi

ENV=$1
ENV_FILE=".env.$ENV"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file $ENV_FILE does not exist!"
    exit 1
fi

# 清理旧的构建文件
echo "🧹 Cleaning up old build files..."

rm -rf dist/
rm -rf .aws-sam/
rm -rf layer/

# 创建必要的目录
mkdir -p dist/
mkdir -p layer/nodejs

# 使用webpack构建应用
echo "🏗️ Building application with nest..."
pnpm run build

# 设置 Lambda Layer：仅包含运行时依赖，避免 pnpm store 过大
echo "📦 Setting up Lambda layer..."
node -e "const fs=require('fs');const pkg=require('./package.json');const out={name:'lambda-layer',version:'1.0.0',private:true,dependencies:pkg.dependencies||{}};fs.writeFileSync('layer/nodejs/package.json',JSON.stringify(out,null,2));"
if [ -f "package-lock.json" ]; then
  cp package-lock.json layer/nodejs/package-lock.json
fi

# 在 layer 中安装依赖（仅生产依赖）
cd layer/nodejs
echo "📦 Installing layer dependencies..."
npm install --omit=dev --ignore-scripts

# 清理无用文件，缩小 Layer 体积
echo "🧹 Cleaning up layer..."
find node_modules -type f -name "*.map" -delete
find node_modules -type f -name "*.md" -delete
find node_modules -type f -name "*.markdown" -delete
find node_modules -type f -name "*.ts" -delete
find node_modules -type f -name "*.d.ts" -delete
find node_modules -type d -name "test" -o -name "tests" -o -name "__tests__" -o -name "docs" -o -name "examples" | xargs rm -rf

echo "📊 Final layer size:"
du -sh node_modules/
cd ../../

# 生成 Prisma Client（为 Lambda 运行时准备）
echo "🧬 Generating Prisma client..."
PRISMA_CLI_BINARY_TARGETS="linux-arm64-openssl-3.0.x,rhel-openssl-1.0.x" \
  npx prisma generate --schema prisma/schema.prisma

# 把生成的 Prisma 客户端复制到 Layer 中
PRISMA_CLIENT_DIR=$(node -e "const path=require('path');const pkg=require.resolve('@prisma/client/package.json');const dir=path.join(path.dirname(pkg),'..','..','.prisma','client');console.log(dir);")
if [ ! -d "$PRISMA_CLIENT_DIR" ]; then
  echo "❌ Prisma client not found at $PRISMA_CLIENT_DIR"
  exit 1
fi
mkdir -p layer/nodejs/node_modules/.prisma
cp -R "$PRISMA_CLIENT_DIR" layer/nodejs/node_modules/.prisma/


# 执行 sam build 和部署
echo "🚀 Running sam build..."
sam build --skip-pull-image

if [ $? -eq 0 ]; then
    if [ "$ENV" = "production" ] || [ "$ENV" = "test" ]; then
        echo "🚀 Deploying to production..."
        sam deploy -g
    else
        echo "🌍 Starting local API..."
        sam local start-api --warm-containers EAGER
    fi
else
    echo "❌ Sam build failed!"
    exit 1
fi
