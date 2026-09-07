import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
void motion;
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

const SelectContext = React.createContext(null);

const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value);

  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, selectedValue, handleSelect }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl px-3 py-2",
        "text-sm text-[#e4e4e7] placeholder:text-[#71717a]",
        "bg-[rgba(0,0,0,0.3)] border border-[rgba(0,240,255,0.15)]",
        "focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[rgba(0,240,255,0.2)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        className
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...props}
    >
      {children}
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="h-4 w-4 opacity-50" />
      </motion.div>
    </motion.button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => {
  const { selectedValue } = React.useContext(SelectContext);
  return <span className="block truncate">{selectedValue || placeholder}</span>;
};

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-xl p-1",
              "bg-[rgba(15,15,25,0.98)] border border-[rgba(0,240,255,0.2)]",
              "backdrop-blur-xl shadow-lg",
              "shadow-[0_10px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(0,240,255,0.1)]",
              className
            )}
            {...props}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { selectedValue, handleSelect } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <motion.div
      ref={ref}
      onClick={() => handleSelect(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3",
        "text-sm text-[#a1a1aa] outline-none",
        "hover:bg-[rgba(0,240,255,0.1)] hover:text-[#e4e4e7]",
        "transition-colors duration-150",
        isSelected && "bg-[rgba(0,240,255,0.15)] text-[#00f0ff]",
        className
      )}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Check className="h-4 w-4 text-[#00f0ff]" />
        </motion.div>
      )}
    </motion.div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
