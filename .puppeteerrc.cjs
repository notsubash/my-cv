module.exports = {
  skipDownload: !!process.env.CI || !!process.env.VERCEL,
}
