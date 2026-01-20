import os
import pandas as pd
import shutil

# Paths
csv_file = "IXI.csv"
image_slices_dir = "image_slice_T1"
dataset_dir = "dataset"

# Age label ranges
age_labels = {
    "Younger Brain": (0, 40),
    "Normal Brain Aging": (41, 60),
    "Mildly Older Brain": (61, 75),
    "Older Brain (Accelerated Aging)": (76, 120)
}

# Create label folders if they don't exist
for label in age_labels.keys():
    os.makedirs(os.path.join(dataset_dir, label), exist_ok=True)

# Read CSV
df = pd.read_csv(csv_file)
df = df[['IXI_ID', 'AGE']]

# Track existing filenames to avoid duplicates
file_counters = {label: {} for label in age_labels.keys()}

# Iterate over each row
for _, row in df.iterrows():
    ixi_id = int(row['IXI_ID'])
    age = row['AGE']

    if pd.isna(age):
        print(f"Warning: Age nan for IXI {ixi_id}")
        continue

    age = int(round(age))  # Ensure age is integer

    # Determine label
    label_found = False
    for label, (min_age, max_age) in age_labels.items():
        if min_age <= age <= max_age:
            label_found = True

            # Find folder containing IXI_ID
            folder_found = None
            for folder_name in os.listdir(image_slices_dir):
                if f"IXI{ixi_id:03d}" in folder_name:
                    folder_found = folder_name
                    break

            if folder_found is None:
                print(f"Warning: Folder not found for IXI {ixi_id}")
                break

            src_folder = os.path.join(image_slices_dir, folder_found)
            dst_folder = os.path.join(dataset_dir, label)

            # Initialize counter dict for this label
            if age not in file_counters[label]:
                file_counters[label][age] = 0

            # Copy and rename PNGs
            for file_name in os.listdir(src_folder):
                if file_name.endswith(".png"):
                    file_counters[label][age] += 1
                    count = file_counters[label][age]

                    if count == 1:
                        new_name = f"{age}.png"
                    else:
                        new_name = f"{age}.{count-1}.png"

                    src_file = os.path.join(src_folder, file_name)
                    dst_file = os.path.join(dst_folder, new_name)

                    shutil.copy(src_file, dst_file)

            break

    if not label_found:
        print(f"Warning: Age {age} for IXI {ixi_id} does not fit any label range")

print("Dataset organized and images renamed by chronological age successfully.")
