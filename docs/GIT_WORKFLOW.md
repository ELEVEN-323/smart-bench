# 团队 Git 协作指南

> 面向 **smart-bench** 项目全体代码组成员。按本文操作即可，不需要 Git 基础。

---

## 一、一次性配置（每人做一次）

### 1.1 安装 Git
下载 https://git-scm.com ，一路下一步安装。

### 1.2 配置身份
打开 **Git Bash**，运行（**替换成你自己的信息**）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

> ⚠️ `你的名字`、`你的邮箱` 是**占位符**，必须换成真实内容。

### 1.3 配置 SSH 密钥（免密码推送）

```bash
# 1. 生成密钥（一路回车即可）
ssh-keygen -t ed25519 -C "你的邮箱"

# 2. 查看公钥，复制输出的一整行
cat ~/.ssh/id_ed25519.pub
```

然后打开 https://github.com/settings/keys → **New SSH key** → 粘贴 → **Add SSH key**。

### 1.4 克隆仓库

```bash
cd ~/Desktop
git clone git@github.com:ELEVEN-323/smart-bench.git
cd smart-bench
```

### 1.5 安装依赖

```bash
pnpm install
```

---

## 二、分支策略

```
main      ← 稳定版（保护分支，只用于演示/部署，禁止直接推）
  └─ dev  ← 集成分支（功能先合到这里测试）
       └─ feature/xxx  ← 每人一个功能分支
```

| 分支 | 用途 | 谁能推 |
|------|------|--------|
| `main` | 可演示的稳定版本 | ❌ 只能通过 PR 合并 |
| `dev` | 集成测试 | ✅ 通过 PR |
| `feature/xxx` | 个人开发 | ✅ 本人随意推 |

---

## 三、日常开发流程（照抄即可）

### 第 1 步：同步最新代码
```bash
git checkout dev
git pull
```

### 第 2 步：开一个功能分支
```bash
git checkout -b feature/语音助手
```
> 分支名建议用英文或拼音，如 `feature/voice-assistant`

### 第 3 步：开发，边写边提交
```bash
git status                # 看改了哪些文件
git add .                 # 暂存所有改动
git commit -m "feat: 实现语音播报与语速调节"
```

### 第 4 步：推送分支
```bash
git push -u origin feature/语音助手
```

### 第 5 步：发起 Pull Request
1. 打开 https://github.com/ELEVEN-323/smart-bench
2. 会看到黄色提示条 → 点 **Compare & pull request**
3. **base 选 `dev`**（⚠️ 不是 main）
4. 写清楚改了什么 → 点 **Create pull request**
5. 通知队友 Review

### 第 6 步：合并后清理
```bash
git checkout dev
git pull
git branch -d feature/语音助手
```

---

## 四、Commit 信息规范

格式：`类型: 简短描述`

| 前缀 | 含义 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 新增紧急呼叫状态机` |
| `fix` | 修 Bug | `fix: 修复地图加载失败` |
| `docs` | 文档 | `docs: 补充运行说明` |
| `style` | 样式 | `style: 调整适老化字号` |
| `refactor` | 重构 | `refactor: 抽离服务封装层` |
| `chore` | 杂务 | `chore: 更新依赖` |

✅ 好的：`feat: 新增语音播报功能`
❌ 差的：`update`、`改了一下`、`111`

---

## 五、五条铁律 🔒

1. **`.env.local` 绝不提交** —— 里面有 API 密钥，已在 `.gitignore` 中
2. **不直接推 `main`** —— 全部走 PR，main 只放能演示的版本
3. **每天至少 push 一次** —— 代码别只存在你电脑里
4. **一个人一个分支** —— 避免互相覆盖
5. **提交前先 `git pull`** —— 减少冲突

---

## 六、常见问题

### Q1：`git push` 提示 Permission denied
SSH 密钥没配好。回到「1.3 配置 SSH 密钥」重做，然后用下面的命令测试：
```bash
ssh -T git@github.com
```
显示 `Hi 你的用户名!` 就对了。

### Q2：忘记 `git pull`，push 被拒绝
```bash
git pull --rebase
git push
```

### Q3：想撤销还没提交的修改
```bash
git checkout -- 文件名        # 撤销单个文件
git checkout -- .             # 撤销全部
```

### Q4：提交信息写错了
```bash
git commit --amend -m "新的信息"
```

### Q5：提交里混进了不该提交的文件
```bash
git rm --cached 文件名        # 从 Git 移除但保留本地文件
```
记得同时把它加进 `.gitignore`。

### Q6：出现冲突（Conflict）
1. 打开冲突文件，找到 `<<<<<<<`、`=======`、`>>>>>>>`
2. 手动保留正确的内容，删掉这些标记
3. 然后：
```bash
git add .
git commit -m "fix: 解决合并冲突"
```

### Q7：想看自己改了什么
```bash
git status          # 哪些文件改了
git diff            # 具体改了什么内容
git log --oneline   # 提交历史
```

---

## 七、常用命令速查

```bash
git status                    # 查看状态
git add .                     # 暂存全部
git commit -m "说明"          # 提交
git push                      # 推送
git pull                      # 拉取
git branch                    # 查看本地分支
git branch -a                 # 查看所有分支
git checkout 分支名           # 切换分支
git checkout -b 新分支名      # 新建并切换
git log --oneline             # 提交历史
```

---

*遇到本文档没覆盖的问题，直接在群里问，或提交 Issue。*
