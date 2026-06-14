<template>
  <!--
    ============================================================
    全站统一背景 — Clean Geometric Grid
    ============================================================
    暗夜基调：深色背景 + 顶部暖金月光 + 底部冷蓝散射光
    几何纹理：60px 微点阵 + 120px 三角网格，清晰干净
  -->

  <!-- 极光 -->
  <div class="fixed inset-0 z-[-10] overflow-hidden pointer-events-none">
    <div class="absolute -left-[10%] -top-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] animate-aurora-1"></div>
    <div class="absolute -right-[10%] -bottom-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] animate-aurora-2"></div>
  </div>

  <svg
    class="fixed inset-0 w-full h-full z-[-9] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- ========================================================
        微点阵 60×60 — 最底层，提供坐标纸般的基底纹理
        ======================================================== -->
      <pattern id="p-dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="0.3" />
        <line x1="0" y1="0" x2="0" y2="60" stroke="rgba(255,255,255,0.03)" stroke-width="0.3" />
        <circle cx="0"  cy="0"  r="0.5" fill="rgba(255,255,255,0.06)" />
        <circle cx="60" cy="0"  r="0.5" fill="rgba(255,255,255,0.06)" />
        <circle cx="0"  cy="60" r="0.5" fill="rgba(255,255,255,0.06)" />
        <circle cx="60" cy="60" r="0.5" fill="rgba(255,255,255,0.06)" />
      </pattern>

      <!-- ========================================================
        三角网格 120×120 — 主结构，方格 + 对角线 → 两个直角三角形
        ======================================================== -->
      <pattern id="p-tri" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="120" height="120" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="0.5" />
        <line x1="0" y1="0" x2="120" y2="120" stroke="rgba(255,255,255,0.11)" stroke-width="0.4" />
        <circle cx="0"   cy="0"   r="1.2" fill="rgba(255,255,255,0.22)" />
        <circle cx="120" cy="0"   r="1.2" fill="rgba(255,255,255,0.22)" />
        <circle cx="0"   cy="120" r="1.2" fill="rgba(255,255,255,0.22)" />
        <circle cx="120" cy="120" r="1.2" fill="rgba(255,255,255,0.22)" />
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#p-dots)" />
    <rect width="100%" height="100%" fill="url(#p-tri)" />
  </svg>
</template>
