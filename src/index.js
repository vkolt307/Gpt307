export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return Response.json({
        ok: true,
        service: 'gpt307',
        message: 'API is running'
      });
    }

    return env.ASSETS.fetch(request);
  }
};
