type Config = {
  nodeEnv: string;
  hostname: string;
  port: number;
  protocol: string;
};

export const config: Config = {
  nodeEnv: process.env.NODE_ENV! || 'development',
  hostname: process.env.HOSTNAME! || 'localhost',
  port: parseInt(process.env.PORT! || '9000', 10),
  protocol: process.env.PROTOCOL! || 'http',
};
