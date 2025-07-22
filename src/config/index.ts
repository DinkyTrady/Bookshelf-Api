type Config = {
  hostname: string;
  port: number;
  nodeEnv: string;
};

const config: Config = {
  hostname: process.env.HOSTNAME! || 'localhost',
  port: parseInt(process.env.PORT!, 10) || 3000,
  nodeEnv: process.env.NODE_ENV! || 'development',
};

export default config;
