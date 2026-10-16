<script>
  import { app, formatBytes, stats, setCols, setLang, createDemo, IMPORT_PX, JPEG_QUALITY } from '../lib/state.svelte.js';
  import { t, lang } from '../lib/i18n.svelte.js';
  import { offlineCapable } from '../lib/pwa.js';
  import NavBar from '../components/NavBar.svelte';
  import NavButton from '../components/NavButton.svelte';
  import Icon from '../components/Icon.svelte';
  const bytes = $derived(app.projects.reduce((a, p) => a + stats(p).bytes, 0));
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const offline = offlineCapable();
  const langs = [{ code: 'pt', label: 'Português' }, { code: 'en', label: 'English' }];
  async function demo() {
    const p = await createDemo();
    app.settingsOpen = false;
    setTimeout(() => { app.tab = 'inbox'; app.projectId = p.id; }, 300);
  }
</script>

<NavBar title={t('app.settings')} scrolled>
  {#snippet left()}<NavButton icon="back" label={t('app.projects')} onclick={() => (app.settingsOpen = false)} />{/snippet}
</NavBar>
<div class="scroll">
  <div class="section-title">{t('settings.photos')}</div>
  <div class="group">
    <div class="row"><span class="grow">{t('settings.size')}</span><span class="value">{IMPORT_PX} px</span></div>
    <div class="row"><span class="grow">{t('settings.quality')}</span><span class="value">{Math.round(JPEG_QUALITY * 100)}%</span></div>
    <div class="row col">
      <div class="line"><span class="grow">{t('settings.cols')}</span><span class="value">{app.cols}</span></div>
      <input type="range" min="3" max="8" step="1" value={app.cols} oninput={(e) => setCols(+e.currentTarget.value)} />
    </div>
  </div>
  <div class="foot">{t('settings.colsHint')}</div>

  <div class="section-title">{t('settings.storage')}</div>
  <div class="group">
    <div class="row"><span class="grow">{t('settings.used')}</span><span class="value">{formatBytes(bytes)}</span></div>
    <div class="row"><span class="grow">{t('settings.persist')}</span>
      {#if app.persisted}<span class="value on"><Icon name="shield" size={16} /> {t('settings.persist.on')}</span>{:else}<span class="value">{t('settings.persist.off')}</span>{/if}
    </div>
    <div class="row"><span class="grow">{t('settings.offline')}</span><span class="value" class:on={offline}>{offline ? t('settings.offline.on') : t('settings.offline.off')}</span></div>
    <div class="row"><span class="grow">{t('settings.installed')}</span><span class="value">{standalone ? t('settings.yes') : t('settings.no')}</span></div>
  </div>
  <div class="foot">{t('settings.storageHint')}</div>

  <div class="section-title">{t('settings.language')}</div>
  <div class="group">
    {#each langs as l}
      <button class="row" onclick={() => setLang(l.code)}>
        <span class="grow">{l.label}</span>
        {#if lang.code === l.code}<span class="ck"><Icon name="check" size={20} stroke={2.6} /></span>{/if}
      </button>
    {/each}
  </div>

  <div class="section-title">{t('settings.about')}</div>
  <div class="group">
    <button class="row tap" onclick={demo}>
      <span class="grow link">{t('settings.demo')}</span><Icon name="photos" size={18} />
    </button>
    <div class="row"><span class="grow">{t('settings.version')}</span><span class="value">1.0.0</span></div>
  </div>
  <div style="height: calc(var(--sab) + 30px)"></div>
</div>

<style>
  .foot { font-size: 13px; color: var(--label2); padding: 7px 20px 0; line-height: 1.35; }
  .col { flex-direction: column; align-items: stretch; padding-top: 10px; padding-bottom: 8px; gap: 4px; }
  .line { display: flex; }
  input[type='range'] { width: 100%; accent-color: var(--accent); }
  .on { color: var(--green); display: inline-flex; align-items: center; gap: 4px; }
  .ck { color: var(--accent); }
  .link { color: var(--accent); }
</style>
