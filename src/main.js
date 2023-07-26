import { logger } from './application/logging.js';
import { web } from './application/web.js';

const PORT = 9000;
web.listen(PORT, () => {
  logger.info(`Server start on port ${PORT}`);
});
