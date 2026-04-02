import { motion } from "framer-motion";

function AuthCard({ title, description, children, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="glass-panel w-full max-w-md p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-coral">Launch Faster</p>
      <h1 className="mt-4 text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">{description}</p>
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6 text-sm text-slate-500 dark:text-slate-300">{footer}</div> : null}
    </motion.div>
  );
}

export default AuthCard;

