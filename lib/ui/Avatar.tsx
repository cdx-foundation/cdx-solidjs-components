import {
  createContext,
  createEffect,
  createSignal,
  type JSX,
  Show,
  splitProps,
  useContext,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { twMerge } from 'tailwind-merge';

type AvatarStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface AvatarContextValue {
  status: () => AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
}

const AvatarContext = createContext<AvatarContextValue>();

/**
 * ### Avatar Component
 *
 * A visual representation of a user or entity. It smartly handles loading states by
 * displaying textual initials whenever an image source is unavailable or invalid.
 *
 * @example
 * ```tsx
 * <Avatar as="a" href="/profile">
 *   <AvatarImage src="https://github.com/nutlope.png" alt="Avatar" />
 *   <AvatarFallback>YA</AvatarFallback>
 * </Avatar>
 * ```
 * @param props - Customization options including `as`.
 */
export const Avatar = (props: JSX.HTMLAttributes<HTMLElement> & { as?: any; href?: string }) => {
  const [local, others] = splitProps(props, ['class', 'children', 'as']);
  const [status, setStatus] = createSignal<AvatarStatus>('idle');

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <Dynamic
        component={local.as || 'div'}
        class={twMerge(
          'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-surface border border-stroke overflow-hidden',
          local.class,
        )}
        {...others}
      >
        {local.children}
      </Dynamic>
    </AvatarContext.Provider>
  );
};

/**
 * ### AvatarImage Component
 *
 * The actual image source for the avatar.
 *
 * @param props - Standard HTML img attributes. `alt` is required for accessibility.
 */
export const AvatarImage = (props: JSX.ImgHTMLAttributes<HTMLImageElement> & { alt: string }) => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('AvatarImage must be used within an Avatar');

  const [local, others] = splitProps(props, ['class', 'onLoad', 'onError', 'alt']);

  createEffect(() => {
    ctx.setStatus('loading');
  });

  return (
    // biome-ignore lint/a11y/useAltText: Alt text is required via props
    <img
      alt={local.alt}
      class={twMerge(
        'aspect-square h-full w-full object-cover',
        ctx.status() !== 'loaded' && 'hidden',
        local.class,
      )}
      onLoad={(e) => {
        ctx.setStatus('loaded');
        if (typeof local.onLoad === 'function') local.onLoad(e);
      }}
      onError={(e) => {
        ctx.setStatus('error');
        if (typeof local.onError === 'function') local.onError(e);
      }}
      {...others}
    />
  );
};

/**
 * ### AvatarFallback Component
 *
 * The fallback content for the avatar when the image is not available or hasn't loaded yet.
 *
 * @param props - Customization options including `as`.
 */
export const AvatarFallback = (props: JSX.HTMLAttributes<HTMLElement> & { as?: any }) => {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('AvatarFallback must be used within an Avatar');

  const [local, others] = splitProps(props, ['class', 'children', 'as']);

  return (
    <Show when={ctx.status() !== 'loaded'}>
      <Dynamic
        component={local.as || 'div'}
        class={twMerge(
          'flex h-full w-full items-center justify-center rounded-card bg-surface text-xs font-semibold uppercase tracking-wider text-muted',
          local.class,
        )}
        {...others}
      >
        {local.children}
      </Dynamic>
    </Show>
  );
};
