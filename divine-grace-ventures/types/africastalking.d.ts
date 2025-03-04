declare module 'africastalking' {
    interface SMSService {
        send(options: { to: string | string[]; message: string; sender?: string }): Promise<any>;
    }

    interface AfricaStalkingInstance {
        SMS: SMSService;
    }

    interface AfricaStalkingConfig {
        apiKey: string;
        username: string;
    }

    function africastalking(config: AfricaStalkingConfig): AfricaStalkingInstance;

    export = africastalking;
}
