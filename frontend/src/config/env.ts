interface EnvironmentConfig {
    apiBaseUrl: string;
    environment: 'development' | 'production' | 'preview';
    features: {
        enableAnalytics: boolean;
        enableDebugMode: boolean;
    };
}

const validateEnvironment = (): EnvironmentConfig => {
    // Default to localhost if not set, or throw if strict validation is needed
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const environment = import.meta.env.VITE_ENVIRONMENT || 'development';

    return {
        apiBaseUrl,
        environment: environment as EnvironmentConfig['environment'],
        features: {
            enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
            enableDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true' || environment === 'development',
        },
    };
};

export const env = validateEnvironment();

export const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = import.meta.env[key];
    if (!value && !defaultValue) {
        throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value || defaultValue!;
};
