import * as timer from "tns-core-modules/timer";


@JavaProxy('com.citylive.ver1.ForegroundService')
class ForegroundService extends android.app.Service {
    onStartCommand(intent, flags, startId) {
        console.log('onStartCommand')
        super.onStartCommand(intent, flags, startId);
        return android.app.Service.START_STICKY;
    }

    onCreate() {
        console.log('onCreate')
        super.onCreate();
        this.startForeground(1, this.getNotification());
    }

    onBind(intent) {
        return super.onBind(intent);
    }

    onUnbind(intent) {
        return super.onUnbind(intent);
    }
 
    // onDestroy() {
    //     console.log('onDestroy')
    //     this.stopForeground(true);
    // }

    private getNotification() {
        const channel = new android.app.NotificationChannel(
            'channel_01',
            'ForegroundService Channel', 
            android.app.NotificationManager.IMPORTANCE_MIN
        );
        const notificationManager = this.getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager;
        notificationManager.createNotificationChannel(channel);
        const builder = new android.app.Notification.Builder(this.getApplicationContext(), 'channel_01');
        builder.setPriority(0xfffffffe);
        builder.setContentTitle('Your City is Live');
        builder.setContentText('Just Updating your location for the latest updates');

        return builder.build();
    }
}