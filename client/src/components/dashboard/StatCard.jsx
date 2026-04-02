import { motion } from "framer-motion";

function StatCard({ label, value, hint }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-panel overflow-hidden p-5">
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-coral">{hint}</p>
    </motion.div>
  );
}

export default StatCard;

