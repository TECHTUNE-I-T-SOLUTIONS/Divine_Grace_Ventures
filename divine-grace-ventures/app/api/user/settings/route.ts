import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  return handleSettings(request);
}

export async function PUT(request: Request) {
  return handleSettings(request, true);
}

async function handleSettings(request: Request, isUpdate = false) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  // Fetch user settings
  const { data: settings, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!settings) {
    // If no settings exist, insert default settings
    const defaultSettings = {
      user_id: userId,
      email_notifications: true,
      sms_notifications: true,
      dark_mode: false,
    };

    if (isUpdate) {
      // If a PUT request is made and no settings exist, insert default + updated values
      const body = await request.json();
      Object.assign(defaultSettings, {
        email_notifications: body.emailNotifications ?? true,
        sms_notifications: body.smsNotifications ?? true,
        dark_mode: body.darkMode ?? false,
      });

      const { error: insertError } = await supabase.from('user_settings').insert([defaultSettings]);

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json(defaultSettings);
    }

    // If GET request, return default settings
    return NextResponse.json(defaultSettings);
  }

  if (isUpdate) {
    // Update settings if they already exist
    const body = await request.json();
    const updatedSettings = {
      email_notifications: body.emailNotifications ?? settings.email_notifications,
      sms_notifications: body.smsNotifications ?? settings.sms_notifications,
      dark_mode: body.darkMode ?? settings.dark_mode,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('user_settings')
      .update(updatedSettings)
      .eq('user_id', userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedSettings);
  }

  // Return settings for GET request
  return NextResponse.json(settings);
}
