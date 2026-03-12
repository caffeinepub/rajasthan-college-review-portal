import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddCollege } from "../hooks/useQueries";

interface AddCollegeDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const COLLEGE_TYPES = [
  "Engineering",
  "Medical",
  "Arts",
  "Science",
  "Commerce",
  "Management",
  "Law",
  "Education",
];

export function AddCollegeDialog({
  open,
  onOpenChange,
}: AddCollegeDialogProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const addCollege = useAddCollege();

  const reset = () => {
    setName("");
    setCity("");
    setCollegeType("");
    setAffiliation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !collegeType || !affiliation.trim()) {
      toast.error("Sabhi fields bharein / Please fill all fields");
      return;
    }
    try {
      await addCollege.mutateAsync({
        name: name.trim(),
        city: city.trim(),
        collegeType,
        affiliation: affiliation.trim(),
      });
      toast.success("College add ho gaya! / College added successfully!");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("College add nahi hua. Dobara try karein.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-ocid="add_college.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Naya College Joḍen / Add New College
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="college-name">College Name *</Label>
            <Input
              id="college-name"
              placeholder="e.g. Government Engineering College, Ajmer"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="college-city">City / Shehar *</Label>
            <Input
              id="college-city"
              placeholder="e.g. Jaipur, Udaipur, Jodhpur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>College Type *</Label>
            <Select value={collegeType} onValueChange={setCollegeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {COLLEGE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="college-affiliation">Affiliation *</Label>
            <Input
              id="college-affiliation"
              placeholder="e.g. RTU, RU, MLSU, Autonomous"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              data-ocid="add_college.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addCollege.isPending}
              data-ocid="add_college.submit_button"
            >
              {addCollege.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {addCollege.isPending ? "Adding..." : "Add College"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
